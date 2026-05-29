<script setup lang="ts">
import { computed } from "vue";
import { Radar } from "vue-chartjs";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export interface RadarItem {
  label: string;
  values: number[];
  color?: string;
}

interface Props {
  /** Labels for each axis (spoke) of the radar. */
  axes: string[];
  /** One entry per series (e.g. one per KPI/category). */
  data: RadarItem[];
  formatValue?: (v: number) => string;
  /**
   * When set, all datasets share this single colour (varied fill opacity).
   * When omitted, each dataset uses its own `RadarItem.color` or the default palette.
   */
  color?: string;
  showLegend?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  formatValue: undefined,
  color: undefined,
  showLegend: true,
});

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

// Fill opacities for mono-colour mode so stacked datasets are still legible.
const MONO_ALPHAS = ["55", "38", "22", "18", "14"];

const chartData = computed<ChartData<"radar">>(() => ({
  labels: props.axes,
  datasets: props.data.map((item, i) => {
    const base = props.color ?? item.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
    const alpha = props.color ? MONO_ALPHAS[i % MONO_ALPHAS.length] : "30";
    return {
      label: item.label,
      data: item.values,
      backgroundColor: `${base}${alpha}`,
      borderColor: base,
      borderWidth: 2,
      pointBackgroundColor: base,
      pointBorderColor: "#fff",
      pointRadius: 3,
      fill: true,
    };
  }),
}));

const chartOptions = computed<ChartOptions<"radar">>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      min: 0,
      max: 100,
      // startAngle: 90, // first spoke points right, no spoke sits on the vertical axis
      ticks: {
        font: { size: 10 },
        color: "#9ca3af",
        backdropColor: "transparent",
        callback: (v) =>
          props.formatValue ? props.formatValue(Number(v)) : String(v),
      },
      pointLabels: {
        font: { size: 12, weight: 600 },
        color: "#374151",
      },
      grid: { color: "rgba(0,0,0,0.07)" },
      angleLines: { color: "rgba(0,0,0,0.1)" },
    },
  },
  plugins: {
    legend: {
      display: props.showLegend,
      position: "right",
      labels: {
        font: { size: 11 },
        color: "#1a1a1a",
        padding: 10,
        boxWidth: 12,
        boxHeight: 12,
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const val = ctx.parsed.r as number;
          const formatted = props.formatValue
            ? props.formatValue(val)
            : String(val);
          return ` ${ctx.dataset.label}: ${formatted}`;
        },
      },
    },
  },
}));
</script>

<template>
  <div v-if="!props.data?.length || !props.axes?.length" class="widget-empty">
    Nessun dato
  </div>
  <div v-else class="widget-radar">
    <Radar :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.widget-radar {
  flex: 1;
  min-height: 0;
  min-width: 0;
  position: relative;
}

.widget-empty {
  font-size: var(--txt-s);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}
</style>
