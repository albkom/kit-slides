<script setup lang="ts">
import { markRaw } from 'vue'
import { SlideDeck, CoverSlide, type DeckSlide } from 'kit-slides'
import MetricsSlide from './slides/MetricsSlide.vue'
import TableSlide from './slides/TableSlide.vue'
import ChartsSlide from './slides/ChartsSlide.vue'

const slides: DeckSlide[] = [
  {
    component: markRaw(CoverSlide),
    isCover: true,
    props: {
      title: 'kit-slides',
      subtitle: 'Component Explorer',
      badge: 'playground',
      meta: 'Static data — no adapters, no CSV',
    },
  },
  {
    component: markRaw(MetricsSlide),
    note: 'WidgetMetric · KpiCard · DeltaBadge · StatusBadge · ProgressBadge',
  },
  {
    component: markRaw(TableSlide),
    note: 'WidgetTable · ColumnDef · delta and status badges',
  },
  {
    component: markRaw(ChartsSlide),
    note: 'WidgetPie · WidgetHistogram · WidgetRadar',
  },
]
</script>

<template>
  <SlideDeck :slides="slides" department="kit-slides playground" />
</template>
