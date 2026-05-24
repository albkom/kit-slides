<script setup lang="ts">
import { computed } from "vue";
import { Pie, Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export interface PieItem {
  label: string;
  value: number;
  color?: string;
}

interface Props {
  data: PieItem[];
  kind?: "pie" | "doughnut";
  formatValue?: (v: number) => string;
}

const props = withDefaults(defineProps<Props>(), {
  kind: "doughnut",
  formatValue: undefined,
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

const chartData = computed<ChartData<"pie"> | ChartData<"doughnut">>(() => ({
  labels: props.data.map((d) => d.label),
  datasets: [
    {
      data: props.data.map((d) => d.value),
      backgroundColor: props.data.map(
        (d, i) => d.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      ),
      borderWidth: 2,
      borderColor: "#ffffff",
    },
  ],
}));

const chartOptions = computed<
  ChartOptions<"pie"> | ChartOptions<"doughnut">
>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
      labels: {
        font: { size: 12 },
        color: "#1a1a1a",
        padding: 12,
        boxWidth: 12,
        boxHeight: 12,
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const val = ctx.parsed as number;
          return ` ${props.formatValue ? props.formatValue(val) : String(val)}`;
        },
      },
    },
  },
}));
</script>

<template>
  <div v-if="!props.data?.length" class="widget-empty">Nessun dato</div>
  <div v-else class="widget-pie">
    <Doughnut
      v-if="kind === 'doughnut'"
      :data="(chartData as ChartData<'doughnut'>)"
      :options="(chartOptions as ChartOptions<'doughnut'>)"
    />
    <Pie
      v-else
      :data="(chartData as ChartData<'pie'>)"
      :options="(chartOptions as ChartOptions<'pie'>)"
    />
  </div>
</template>

<style scoped>
.widget-pie {
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
