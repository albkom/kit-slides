<script setup lang="ts">
import KpiCard from '../ui/KpiCard.vue'
import type { KpiCardDef } from '../../types'
import type { ChartData } from 'chart.js'

interface Props {
  title?: string
  meta?: string
  cards: KpiCardDef[]
}
const props = withDefaults(defineProps<Props>(), {
  title: '',
  meta: '',
  cards: () => [],
})
</script>

<template>
  <div v-if="!props.cards || !props.cards.length" class="slide slide-error">
    Slide "KpiSlide": prop <code>cards</code> mancante o vuota.
  </div>
  <div v-else class="slide slide-kpi">
    <div v-if="title || meta" class="slide-header">
      <h2 v-if="title" class="slide-title">{{ title }}</h2>
      <span v-if="meta" class="slide-meta">{{ meta }}</span>
    </div>
    <div class="kpi-grid">
      <KpiCard
        v-for="(c, i) in cards"
        :key="`${c.label}-${i}`"
        :label="c.label"
        :value="String(c.value)"
        :delta="c.delta ?? null"
        :icon="c.icon ?? ''"
        :pie-data="(c.pieData as ChartData<'doughnut'> | null | undefined) ?? null"
      />
    </div>
  </div>
</template>
