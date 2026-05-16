<script setup>
import { computed } from 'vue'
import KpiCard from '../ui/KpiCard.vue'

const props = defineProps({
  summary: { type: Object, required: true },
  week: { type: Number, required: true },
  year: { type: Number, required: true },
})

const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
const num = new Intl.NumberFormat('it-IT')
const pct = new Intl.NumberFormat('it-IT', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 })

const kpis = computed(() => [
  { label: 'Fatturato',         value: eur.format(props.summary.fatturato),                  delta: props.summary.fatturato_delta,         icon: '💶' },
  { label: 'Ordini',            value: num.format(props.summary.ordini),                    delta: props.summary.ordini_delta,            icon: '📦' },
  { label: 'Tasso Conversione', value: pct.format(props.summary.tasso_conversione / 100),   delta: props.summary.tasso_conversione_delta, icon: '🔄' },
  { label: 'Ticket Medio',      value: eur.format(props.summary.ticket_medio),              delta: props.summary.ticket_medio_delta,      icon: '🧾' },
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
