<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps({
  channels: { type: Array, required: true },
  week: { type: Number, required: true },
  year: { type: Number, required: true },
})

const rows = computed(() => props.channels)

const chartData = computed(() => ({
  labels: rows.value.map((r) => r.name),
  datasets: [
    {
      label: 'KPI 1',
      data: rows.value.map((r) => r.kpi_1),
      backgroundColor: 'rgba(34, 139, 34, 0.85)',
      borderColor: '#228B22',
      borderWidth: 1,
      borderRadius: 4,
      maxBarThickness: 14,
      xAxisID: 'x',
    },
    {
      label: 'KPI 2',
      data: rows.value.map((r) => r.kpi_2),
      backgroundColor: 'rgba(251, 188, 5, 0.85)',
      borderColor: '#FBBC05',
      borderWidth: 1,
      borderRadius: 4,
      maxBarThickness: 14,
      xAxisID: 'x',
    },
    {
      label: 'Total',
      data: rows.value.map((r) => r.total),
      backgroundColor: 'rgba(100, 149, 237, 0.5)',
      borderColor: '#6495ED',
      borderWidth: 1,
      borderRadius: 4,
      maxBarThickness: 14,
      xAxisID: 'x1',
    },
  ],
}))

const maxTotal = computed(() => Math.max(...rows.value.map((r) => r.total), 1))

const chartPlugin = {
  id: 'chartExtras',
  afterDraw(chart) {
    const { ctx, chartArea } = chart
    const nDatasets = chart.data.datasets.length
    const meta0 = chart.getDatasetMeta(0)
    const metaLast = chart.getDatasetMeta(nDatasets - 1)

    ctx.save()
    ctx.fillStyle = 'rgba(30, 30, 30, 0.88)'
    ctx.font = 'bold 11px sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'

    meta0.data.forEach((firstBar, i) => {
      const lastBar = metaLast.data[i]
      const groupTop = firstBar.y - firstBar.height / 2
      const groupBottom = lastBar.y + lastBar.height / 2
      ctx.fillText(rows.value[i].name, chartArea.left + 6, (groupTop + groupBottom) / 2)
    })

    ctx.restore()
  },
}

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  layout: { padding: { left: 4, right: 8, top: 8, bottom: 0 } },
  scales: {
    x: {
      stacked: false,
      min: 0,
      max: 100,
      position: 'bottom',
      ticks: { callback: (v) => `${v}%` },
    },
    x1: {
      stacked: false,
      min: 0,
      max: Math.ceil(maxTotal.value * 1.15),
      position: 'top',
      grid: { drawOnChartArea: false },
      ticks: { color: '#6495ED' },
      title: { display: true, text: 'Total', color: '#6495ED', font: { size: 11 } },
    },
    y: {
      stacked: false,
      ticks: { display: false },
      grid: { display: false },
    },
  },
  plugins: {
    legend: { display: true, position: 'bottom' },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          if (ctx.dataset.xAxisID === 'x1') return `${ctx.dataset.label}: ${ctx.parsed.x}`
          return `${ctx.dataset.label}: ${ctx.parsed.x.toFixed(1)}%`
        },
      },
    },
  },
}))

</script>

<template>
  <div class="slide slide-chart">
    <div class="slide-header">
      <h2 class="slide-title">Fatturato per Canale</h2>
      <span class="slide-meta">W{{ week }} · {{ year }}</span>
    </div>
    <div class="chart-wrapper">
      <Bar :data="chartData" :options="chartOptions" :plugins="[chartPlugin]" />
    </div>
  </div>
</template>
