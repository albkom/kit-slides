<script setup>
import { computed } from 'vue'
import { KpiCard } from '../../../index.js'

const props = defineProps({
  summary: { type: Object, required: true },
  channels: { type: Array, default: () => [] },
  week: { type: Number, required: true },
  year: { type: Number, required: true },
})

const PIE_COLORS = ['#185FA5', '#931d9e', '#7c0c4b', '#1d9e75', '#d97706', '#dc2626']

function pieDataFor(field) {
  if (!props.channels.length) return null
  return {
    labels: props.channels.map((c) => c.canale),
    datasets: [{
      data: props.channels.map((c) => c[field] ?? 0),
      backgroundColor: props.channels.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]),
      borderWidth: 0,
    }],
  }
}

function ticketMedioPieData() {
  if (!props.channels.length) return null
  return {
    labels: props.channels.map((c) => c.canale),
    datasets: [{
      data: props.channels.map((c) => c.ordini > 0 ? Math.round(c.fatturato / c.ordini) : 0),
      backgroundColor: props.channels.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]),
      borderWidth: 0,
    }],
  }
}

const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
const num = new Intl.NumberFormat('it-IT')
const pct = new Intl.NumberFormat('it-IT', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 })

const kpis = computed(() => [
  { label: 'Elemento 1',         value: eur.format(props.summary.fatturato),                  delta: props.summary.fatturato_delta,         icon: '', pieData: pieDataFor('fatturato') },
  { label: 'Elemento 2',            value: num.format(props.summary.ordini),                    delta: props.summary.ordini_delta,            icon: '', pieData: pieDataFor('ordini') },
  { label: 'Elemento 3', value: pct.format(props.summary.tasso_conversione / 100),   delta: props.summary.tasso_conversione_delta, icon: '', pieData: pieDataFor('tasso_conversione') },
  { label: 'Elemento 4',      value: eur.format(props.summary.ticket_medio),              delta: props.summary.ticket_medio_delta,      icon: '', pieData: ticketMedioPieData() },
])
</script>

<template>
  <div class="slide slide-kpi">
    <div class="slide-header">
      <h2 class="slide-title">KPI Principali</h2>
      <span class="slide-meta">W{{ week }} · {{ year }}</span>
    </div>
    <div class="kpi-grid">
      <KpiCard v-for="kpi in kpis" :key="kpi.label" v-bind="kpi" />
    </div>
  </div>
</template>
