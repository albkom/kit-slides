<script setup lang="ts">
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import type { ChartData, ChartOptions, TooltipItem } from "chart.js";
import DeltaBadge from "./DeltaBadge.vue";
import { KpiMonitor } from "../../types";

ChartJS.register(ArcElement, Tooltip);

interface Props {
  label: string;
  value: string;
  subValue?: string;
  monitor?: KpiMonitor;
  delta?: number | null;
  icon?: string;
  pieData?: ChartData<"doughnut"> | null;
}
withDefaults(defineProps<Props>(), {
  delta: null,
  icon: "",
  pieData: null,
});

const chartOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "68%",
  animation: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: TooltipItem<"doughnut">) => {
          const data = ctx.dataset.data as number[];
          const total = data.reduce((a, b) => a + b, 0);
          const raw = ctx.raw as number;
          const pct = total > 0 ? ((raw / total) * 100).toFixed(1) : "0";
          return ` ${ctx.label}: ${pct}%`;
        },
      },
    },
  },
};
</script>

<template>
  <div class="kpi-card">
    <div class="kpi-header">
      <span v-if="icon" class="kpi-icon">{{ icon }}</span>
      <span class="kpi-label">{{ label }}</span>
    </div>
    <div class="kpi-body">
      <div class="kpi-value">{{ value }}</div>
      <div v-if="pieData" class="kpi-chart">
        <Doughnut :data="pieData" :options="chartOptions" />
      </div>
      <!-- <div v-if="subValue" class="kpi-sub-value">{{ subValue }}</div> -->
    </div>
    <div class="kpi-monitor" v-if="monitor">
      <div class="kpi-monitor-body">
        <div class="kpi-monitor-label">{{ monitor.label }}</div>
        <div class="kpi-monitor-value">{{ monitor.value }}</div>
      </div>
      <div class="kpi-monitor-footer">
        <DeltaBadge :value="monitor.delta" />
        <span class="kpi-vs">{{ monitor.prev }}</span>
      </div>
    </div>
  </div>
</template>
