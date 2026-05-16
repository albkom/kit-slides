<script setup>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import DeltaBadge from './DeltaBadge.vue'

ChartJS.register(ArcElement, Tooltip)

defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  delta: { type: Number, default: null },
  icon: { type: String, default: '' },
  pieData: { type: Object, default: null },
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  animation: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
          const pct = total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : 0
          return ` ${ctx.label}: ${pct}%`
        },
      },
    },
  },
}
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
    </div>
    <div class="kpi-footer">
      <DeltaBadge :value="delta" />
      <span class="kpi-vs">vs settimana prec.</span>
    </div>
  </div>
</template>
