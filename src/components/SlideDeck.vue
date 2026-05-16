<script setup>
import { computed, markRaw } from 'vue'
import Slide from './Slide.vue'
import SlideCover from './slides/SlideCover.vue'
import SlideKpi from './slides/SlideKpi.vue'
import SlideChart from './slides/SlideChart.vue'
import SlideTable from './slides/SlideTable.vue'
import SlideMap from './slides/SlideMap.vue'

const props = defineProps({
  summary: { type: Object, required: true },
  channels: { type: Array, required: true },
  categories: { type: Array, required: true },
  geoData: { type: Array, default: () => [] },
  currentWeek: { type: Object, required: true },
})

const slides = computed(() => [
  { c: markRaw(SlideCover), p: { week: props.currentWeek.week, year: props.currentWeek.year } },
  { c: markRaw(SlideKpi),   p: { summary: props.summary, channels: props.channels, week: props.currentWeek.week, year: props.currentWeek.year } },
  { c: markRaw(SlideChart), p: { channels: props.channels, week: props.currentWeek.week, year: props.currentWeek.year } },
  { c: markRaw(SlideTable), p: { categories: props.categories, week: props.currentWeek.week, year: props.currentWeek.year } },
  { c: markRaw(SlideMap),   p: { geoData: props.geoData, week: props.currentWeek.week, year: props.currentWeek.year } },
])

function printPdf() { window.print() }
</script>

<template>
  <div class="deck">
    <div class="toolbar">
      <button class="btn-primary" @click="printPdf">⬇ Scarica PDF</button>
    </div>

    <div class="stage">
      <div
        v-for="(s, i) in slides"
        :key="i"
        class="slide-page"
      >
        <Slide :slide-number="i + 1">
          <component :is="s.c" v-bind="s.p" />
        </Slide>
      </div>
    </div>
  </div>
</template>
