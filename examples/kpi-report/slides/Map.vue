<script setup>
import { computed, ref } from 'vue'
import { geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import worldData from 'world-atlas/countries-110m.json'
import { alpha2ToNumeric, numericToAlpha2, countryNames } from '../countryData.js'

const props = defineProps({
  geoData: { type: Array, default: () => [] },
  week: { type: Number, required: true },
  year: { type: Number, required: true },
})

// ── Map geometry (computed once at module level) ─────────────────────────────
const MAP_W = 900
const MAP_H = 460

const worldFeatures = feature(worldData, worldData.objects.countries)
const projection = geoNaturalEarth1().fitSize([MAP_W, MAP_H], worldFeatures)
const pathGen = geoPath(projection)
const basePaths = worldFeatures.features
  .map((f) => ({ id: f.id, d: pathGen(f) }))
  .filter((p) => p.d)

// ── Value lookup & color scale ───────────────────────────────────────────────
const valueMap = computed(() => {
  const m = new Map()
  for (const d of props.geoData) {
    const n = alpha2ToNumeric[d.code]
    if (n != null) m.set(String(n), d.value)
  }
  return m
})

const extent = computed(() => {
  const vals = props.geoData.map((d) => d.value)
  return vals.length ? { min: Math.min(...vals), max: Math.max(...vals) } : { min: 0, max: 1 }
})

function lerpColor(t) {
  return `rgb(${Math.round(230 + (12 - 230) * t)},${Math.round(241 + (68 - 241) * t)},${Math.round(251 + (124 - 251) * t)})`
}

function fillFor(id) {
  const { min, max } = extent.value
  const val = valueMap.value.get(String(id))
  return val != null ? lerpColor((val - min) / (max - min || 1)) : '#ccd8e2'
}

const paths = computed(() =>
  basePaths.map((p) => ({
    ...p,
    fill: fillFor(p.id),
    value: valueMap.value.get(String(p.id)) ?? null,
  })),
)

// ── Top 5 countries ──────────────────────────────────────────────────────────
const top5 = computed(() =>
  [...props.geoData]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
    .map((d) => ({
      code: d.code,
      name: countryNames[d.code] ?? d.code,
      value: d.value,
    })),
)

// ── Formatting ───────────────────────────────────────────────────────────────
const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
const numFmt = new Intl.NumberFormat('it-IT')

function compact(v) {
  if (v >= 1_000_000) return '€' + (v / 1_000_000).toFixed(1).replace('.', ',') + 'M'
  if (v >= 1_000)     return '€' + Math.round(v / 1_000) + 'K'
  return '€' + Math.round(v)
}

// ── Tooltip ──────────────────────────────────────────────────────────────────
const mapRef = ref(null)
const tooltip = ref({ visible: false, x: 0, y: 0, name: '', value: '' })

function showTooltip(p, e) {
  const rect = mapRef.value?.getBoundingClientRect()
  const a2 = numericToAlpha2[String(p.id)]
  tooltip.value = {
    visible: true,
    x: e.clientX - (rect?.left ?? 0),
    y: e.clientY - (rect?.top ?? 0),
    name: (a2 && countryNames[a2]) ?? '—',
    value: p.value != null ? eur.format(p.value) : '(nessun dato)',
  }
}
function moveTooltip(e) {
  if (!tooltip.value.visible) return
  const rect = mapRef.value?.getBoundingClientRect()
  tooltip.value.x = e.clientX - (rect?.left ?? 0)
  tooltip.value.y = e.clientY - (rect?.top ?? 0)
}
function hideTooltip() { tooltip.value.visible = false }
</script>

<template>
  <div class="slide slide-map">
    <div class="map-main">
      <div class="slide-header">
        <h2 class="slide-title">Performance Geografica</h2>
        <span class="slide-meta">W{{ week }} · {{ year }}</span>
      </div>

      <div ref="mapRef" class="map-frame" @mousemove="moveTooltip" @mouseleave="hideTooltip">
        <svg :viewBox="`0 0 ${MAP_W} ${MAP_H}`" preserveAspectRatio="xMidYMid meet">
          <path
            v-for="p in paths" :key="p.id"
            :d="p.d" :fill="p.fill"
            stroke="white" stroke-width="0.5"
            @mouseenter="showTooltip(p, $event)"
          />
        </svg>

        <div v-if="tooltip.visible" class="tooltip"
          :style="{ left: tooltip.x + 14 + 'px', top: tooltip.y - 52 + 'px' }">
          <span class="tt-name">{{ tooltip.name }}</span>
          <span class="tt-value">{{ tooltip.value }}</span>
        </div>
      </div>

      <div class="legend">
        <span class="legend-label">{{ geoData.length ? numFmt.format(extent.min) : '' }}</span>
        <div class="legend-bar" />
        <span class="legend-label end">{{ geoData.length ? numFmt.format(extent.max) : '' }}</span>
      </div>
    </div>

    <aside class="top5">
      <h3>Top 5 Paesi</h3>
      <ol v-if="top5.length">
        <li v-for="(c, i) in top5" :key="c.code">
          <span class="rank">{{ i + 1 }}</span>
          <span class="name">{{ c.name }}</span>
          <span class="value">{{ compact(c.value) }}</span>
        </li>
      </ol>
      <div v-else class="empty">nessun dato</div>
    </aside>
  </div>
</template>
