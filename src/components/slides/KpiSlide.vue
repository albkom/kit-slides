<script setup lang="ts">
import { inject, computed } from 'vue'
import type { ComputedRef } from 'vue'
import KpiCard from '../ui/KpiCard.vue'
import SlideTopper from '../SlideTopper.vue'
import type { KpiCardDef } from '../../types'
import type { ChartData } from 'chart.js'

interface TopperData { logo: string | null; department: string | null }
const _topper = inject<ComputedRef<TopperData>>('slideTopper')
const hasTopper = computed(() => !!(_topper?.value?.logo || _topper?.value?.department))

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
    <div v-if="title || meta || hasTopper" class="slide-header">
      <h2 v-if="title" class="slide-title">{{ title }}</h2>
      <SlideTopper />
    </div>
    <div class="kpi-grid">
      <KpiCard
        v-for="(c, i) in cards"
        :key="`${c.label}-${i}`"
        :label="c.label"
        :value="String(c.value)"
        :sub-value="c.subValue ? String(c.subValue) : undefined"
        :monitor="c.monitor ? c.monitor : undefined"
        :delta="c.delta ?? null"
        :icon="c.icon ?? ''"
        :pie-data="(c.pieData as ChartData<'doughnut'> | null | undefined) ?? null"
      />
    </div>
  </div>
</template>
