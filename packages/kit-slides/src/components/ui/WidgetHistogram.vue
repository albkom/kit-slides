<script setup lang="ts">
import { computed } from "vue";

export interface HistogramItem {
  label: string;
  value: number;
  color?: string;
}

interface Props {
  data: HistogramItem[];
  formatValue?: (v: number) => string;
  barColor?: string;
  showValues?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  formatValue: undefined,
  barColor: undefined,
  showValues: true,
});

const W = 500;
const H = 260;
const PAD = { top: 24, right: 12, bottom: 40, left: 48 };
const innerW = W - PAD.left - PAD.right;
const innerH = H - PAD.top - PAD.bottom;

const DEFAULT_COLORS = [
  "#185fa5",
  "#931d9e",
  "#7c0c4b",
  "#1d9e75",
  "#d97706",
  "#dc2626",
  "#3b82f6",
  "#8b5cf6",
];

const maxVal = computed(() => Math.max(...props.data.map((d) => d.value), 1));

const bars = computed(() => {
  const n = props.data.length;
  const slotW = innerW / n;
  const barW = slotW * 0.7;
  return props.data.map((d, i) => {
    const barH = (d.value / maxVal.value) * innerH;
    return {
      x: PAD.left + i * slotW + (slotW - barW) / 2,
      y: PAD.top + innerH - barH,
      w: barW,
      h: barH,
      label: d.label,
      value: d.value,
      color: props.barColor ?? d.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      cx: PAD.left + i * slotW + slotW / 2,
    };
  });
});

const yTicks = computed(() => {
  const steps = 4;
  return Array.from({ length: steps + 1 }, (_, i) => {
    const frac = i / steps;
    const val = maxVal.value * frac;
    return {
      y: PAD.top + innerH - frac * innerH,
      label: props.formatValue
        ? props.formatValue(val)
        : String(Math.round(val)),
    };
  });
});

function fmt(v: number): string {
  return props.formatValue ? props.formatValue(v) : String(v);
}
</script>

<template>
  <div v-if="!props.data?.length" class="widget-empty">Nessun dato</div>
  <div v-else class="widget-histogram">
    <svg :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="xMidYMid meet">
      <!-- Y grid lines -->
      <line
        v-for="t in yTicks"
        :key="t.y"
        :x1="PAD.left"
        :y1="t.y"
        :x2="PAD.left + innerW"
        :y2="t.y"
        stroke="rgba(0,0,0,0.08)"
        stroke-width="1"
      />
      <!-- Y axis labels -->
      <text
        v-for="t in yTicks"
        :key="'yl' + t.y"
        :x="PAD.left - 6"
        :y="t.y"
        text-anchor="end"
        dominant-baseline="middle"
        class="axis-label"
      >{{ t.label }}</text>

      <!-- Bars -->
      <rect
        v-for="b in bars"
        :key="b.label"
        :x="b.x"
        :y="b.y"
        :width="b.w"
        :height="b.h"
        :fill="b.color"
        rx="3"
      />

      <!-- Value labels above bars -->
      <template v-if="showValues">
        <text
          v-for="b in bars"
          :key="'val' + b.label"
          :x="b.x + b.w / 2"
          :y="b.y - 4"
          text-anchor="middle"
          class="bar-value"
        >{{ fmt(b.value) }}</text>
      </template>

      <!-- X axis labels -->
      <text
        v-for="b in bars"
        :key="'xl' + b.label"
        :x="b.cx"
        :y="PAD.top + innerH + 16"
        text-anchor="middle"
        class="axis-label"
      >{{ b.label }}</text>

      <!-- X axis baseline -->
      <line
        :x1="PAD.left"
        :y1="PAD.top + innerH"
        :x2="PAD.left + innerW"
        :y2="PAD.top + innerH"
        stroke="rgba(0,0,0,0.2)"
        stroke-width="1"
      />
    </svg>
  </div>
</template>

<style scoped>
.widget-histogram {
  flex: 1;
  min-height: 0;
  min-width: 0;
  display: flex;

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.widget-empty {
  font-size: var(--txt-s);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.axis-label {
  font-size: 11px;
  fill: var(--text-secondary, #6b7280);
  font-family: var(--font-stack);
}

.bar-value {
  font-size: 11px;
  font-weight: 600;
  fill: var(--text-primary, #1a1a1a);
  font-family: var(--font-stack);
}
</style>
