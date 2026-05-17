<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js'
import DeltaBadge from './DeltaBadge.vue'

ChartJS.register(ArcElement, Tooltip)

interface Props {
  label: string
  value: string
  delta?: number | null
  icon?: string
  pieData?: ChartData<'doughnut'> | null
}
withDefaults(defineProps<Props>(), {
  delta: null,
  icon: '',
  pieData: null,
})

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  animation: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: TooltipItem<'doughnut'>) => {
          const data = ctx.dataset.data as number[]
          const total = data.reduce((a, b) => a + b, 0)
          const raw = ctx.raw as number
          const pct = total > 0 ? ((raw / total) * 100).toFixed(1) : '0'
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
