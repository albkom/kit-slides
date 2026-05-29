<script setup lang="ts">
import { computed, ref } from "vue";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import worldData from "world-atlas/countries-110m.json";
import type { GeoDataPoint } from "../../types";

interface Props {
  data: GeoDataPoint[];
  title?: string;
  meta?: string;
  topCount?: number;
  countryNames?: Record<string, string>;
  formatValue?: (value: number) => string;
  formatCompact?: (value: number) => string;
  /** alpha-2 → numeric ISO map (for matching CSV codes to world-atlas IDs). */
  alpha2ToNumeric?: Record<string, string | number>;
  /** numeric ISO → alpha-2 map (for tooltip lookup). */
  numericToAlpha2?: Record<string, string>;
}
const props = withDefaults(defineProps<Props>(), {
  title: "",
  meta: "",
  topCount: 5,
  countryNames: () => ({}),
  formatValue: undefined,
  formatCompact: undefined,
  alpha2ToNumeric: () => ({}),
  numericToAlpha2: () => ({}),
});

const MAP_W = 900;
const MAP_H = 460;

const worldFeatures = feature(
  worldData,
  worldData.objects.countries,
) as unknown as FeatureCollection<Geometry, { name?: string }>;

const projection = geoNaturalEarth1().fitSize([MAP_W, MAP_H], worldFeatures);
const pathGen = geoPath(projection);
const basePaths = worldFeatures.features
  .map((f) => ({ id: f.id as string | number | undefined, d: pathGen(f) }))
  .filter(
    (p): p is { id: string | number | undefined; d: string } => p.d != null,
  );

const valueMap = computed(() => {
  const m = new Map<string, number>();
  for (const d of props.data) {
    const n = props.alpha2ToNumeric[d.code];
    if (n != null) m.set(String(n), d.value);
  }
  return m;
});

const extent = computed(() => {
  const vals = props.data.map((d) => d.value);
  return vals.length
    ? { min: Math.min(...vals), max: Math.max(...vals) }
    : { min: 0, max: 1 };
});

function lerpColor(t: number): string {
  if (t <= 0.5) {
    const p = Math.round(t * 2 * 100);
    return `color-mix(in srgb, var(--brand-primary) ${p}%, var(--border))`;
  } else {
    const p = Math.round((t - 0.5) * 2 * 100);
    return `color-mix(in srgb, var(--brand-accent) ${p}%, var(--brand-primary))`;
  }
}
function fillFor(id: string | number | undefined): string {
  const { min, max } = extent.value;
  const val = id != null ? valueMap.value.get(String(id)) : undefined;
  return val != null ? lerpColor((val - min) / (max - min || 1)) : "#cccccc";
}

interface MapPath {
  id: string | number | undefined;
  d: string;
  fill: string;
  value: number | null;
}
const paths = computed<MapPath[]>(() =>
  basePaths.map((p) => ({
    ...p,
    fill: fillFor(p.id),
    value:
      (p.id != null ? valueMap.value.get(String(p.id)) : undefined) ?? null,
  })),
);

const defaultFmt = new Intl.NumberFormat("en-US");
const fmtValue = (v: number) =>
  props.formatValue ? props.formatValue(v) : defaultFmt.format(v);
const fmtCompact = (v: number) =>
  props.formatCompact ? props.formatCompact(v) : defaultFmt.format(v);

const mapRef = ref<HTMLDivElement | null>(null);
const tooltip = ref({ visible: false, x: 0, y: 0, name: "", value: "" });

function showTooltip(p: MapPath, e: MouseEvent) {
  const rect = mapRef.value?.getBoundingClientRect();
  const a2 = p.id != null ? props.numericToAlpha2[String(p.id)] : undefined;
  tooltip.value = {
    visible: true,
    x: e.clientX - (rect?.left ?? 0),
    y: e.clientY - (rect?.top ?? 0),
    name: (a2 && props.countryNames[a2]) ?? "—",
    value: p.value != null ? fmtValue(p.value) : "(nessun dato)",
  };
}
function moveTooltip(e: MouseEvent) {
  if (!tooltip.value.visible) return;
  const rect = mapRef.value?.getBoundingClientRect();
  tooltip.value.x = e.clientX - (rect?.left ?? 0);
  tooltip.value.y = e.clientY - (rect?.top ?? 0);
}
function hideTooltip() {
  tooltip.value.visible = false;
}
</script>

<template>
  <div v-if="!props.data" class="slide slide-error">
    Slide "WidgetMap": prop <code>data</code> mancante.
  </div>
  <div class="map-content" v-else>
    <div class="map-container">
      <div
        ref="mapRef"
        class="map-frame"
        @mousemove="moveTooltip"
        @mouseleave="hideTooltip"
      >
        <svg
          :viewBox="`0 0 ${MAP_W} ${MAP_H}`"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            v-for="p in paths"
            :key="String(p.id)"
            :d="p.d"
            :fill="p.fill"
            stroke="white"
            stroke-width="0.5"
            @mouseenter="showTooltip(p, $event)"
          />
        </svg>

        <div
          v-if="tooltip.visible"
          class="tooltip"
          :style="{
            left: tooltip.x + 14 + 'px',
            top: tooltip.y - 52 + 'px',
          }"
        >
          <span class="tt-name">{{ tooltip.name }}</span>
          <span class="tt-value">{{ tooltip.value }}</span>
        </div>
      </div>
      <div class="legend">
        <span class="legend-label">{{
          data.length ? fmtCompact(extent.min) : ""
        }}</span>
        <div class="legend-bar" />
        <span class="legend-label end">{{
          data.length ? fmtCompact(extent.max) : ""
        }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-content {
  flex: 1;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow: hidden;
}

.map-container {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.map-frame {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.legend {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 18px;
}
</style>
