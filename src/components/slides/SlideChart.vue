<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps({
  channels: { type: Array, required: true },
  week: { type: Number, required: true },
  year: { type: Number, required: true },
})

const eur = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const chartData = computed(() => ({
  labels: props.channels.map((c) => c.canale),
  datasets: [
    {
      label: 'Fatturato',
      data: props.channels.map((c) => c.fatturato),
      backgroundColor: 'rgba(24, 95, 165, 0.85)',
      borderColor: '#185FA5',
      borderWidth: 1,
      borderRadius: 6,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${eur.format(ctx.raw)}`,
      },
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(0,0,0,0.05)' },
      ticks: {
        callback: (v) => `€${(v / 1000).toFixed(0)}K`,
        font: { size: 11 },
      },
    },
    y: {
      grid: { display: false },
      ticks: { font: { size: 13, weight: '600' } },
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
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.slide-chart {
  background: var(--surface);
  display: flex;
  flex-direction: column;
  padding: var(--slide-padding);
  gap: 1.5rem;
}

.slide-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.slide-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--brand-dark);
}

.slide-meta {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.chart-wrapper {
  flex: 1;
  min-height: 0;
  position: relative;
}
</style>
