<script setup lang="ts">
import { computed } from 'vue'
import { KpiSlide } from '../../../index'
import type { KpiCardDef, KpiSummary, KpiChannel } from '../../../index'
import type { ChartData } from 'chart.js'

interface Props {
  summary: KpiSummary
  channels?: KpiChannel[]
  week: number
  year: number
}
const props = withDefaults(defineProps<Props>(), {
  channels: () => [],
})

const PIE_COLORS = ['#185FA5', '#931d9e', '#7c0c4b', '#1d9e75', '#d97706', '#dc2626']

type NumericChannelField = 'total' | 'oks' | 'kos' | 'draws' | 'kpi_1' | 'kpi_2' | 'kpi_3'

function pieDataFor(field: NumericChannelField): ChartData<'doughnut'> | null {
  if (!props.channels.length) return null
  return {
    labels: props.channels.map((c) => c.name),
    datasets: [{
      data: props.channels.map((c) => c[field] ?? 0),
      backgroundColor: props.channels.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]),
      borderWidth: 0,
    }],
  }
}

function ticketMedioPieData(): ChartData<'doughnut'> | null {
  if (!props.channels.length) return null
  return {
    labels: props.channels.map((c) => c.name),
    datasets: [{
      data: props.channels.map((c) => c.oks > 0 ? Math.round(c.total / c.oks) : 0),
      backgroundColor: props.channels.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]),
      borderWidth: 0,
    }],
  }
}

const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
const num = new Intl.NumberFormat('it-IT')
const pct = new Intl.NumberFormat('it-IT', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 })

const cards = computed<KpiCardDef[]>(() => [
  { label: 'Elemento 1', value: eur.format(props.summary.fatturato),                delta: props.summary.fatturato_delta,         pieData: pieDataFor('total') },
  { label: 'Elemento 2', value: num.format(props.summary.ordini),                   delta: props.summary.ordini_delta,            pieData: pieDataFor('oks') },
  { label: 'Elemento 3', value: pct.format(props.summary.tasso_conversione / 100),  delta: props.summary.tasso_conversione_delta, pieData: pieDataFor('kpi_1') },
  { label: 'Elemento 4', value: eur.format(props.summary.ticket_medio),             delta: props.summary.ticket_medio_delta,      pieData: ticketMedioPieData() },
])

const meta = computed(() => `W${props.week} · ${props.year}`)
</script>

<template>
  <KpiSlide title="KPI Principali" :meta="meta" :cards="cards" />
</template>
