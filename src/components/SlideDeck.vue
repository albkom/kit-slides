<script setup>
import { computed, ref, onMounted, onUnmounted, markRaw } from 'vue'
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
  { c: markRaw(SlideKpi),   p: { summary: props.summary, week: props.currentWeek.week, year: props.currentWeek.year } },
  { c: markRaw(SlideChart), p: { channels: props.channels, week: props.currentWeek.week, year: props.currentWeek.year } },
  { c: markRaw(SlideTable), p: { categories: props.categories, week: props.currentWeek.week, year: props.currentWeek.year } },
  { c: markRaw(SlideMap),   p: { geoData: props.geoData, week: props.currentWeek.week, year: props.currentWeek.year } },
])

const current = ref(0)
const printing = ref(false)

function prev() { if (current.value > 0) current.value-- }
function next() { if (current.value < slides.value.length - 1) current.value++ }

function onKey(e) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') next()
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp') prev()
}

function printPdf() { window.print() }

function onBeforePrint() { printing.value = true }
function onAfterPrint()  { printing.value = false }

onMounted(() => {
  window.addEventListener('keydown', onKey)
  window.addEventListener('beforeprint', onBeforePrint)
  window.addEventListener('afterprint', onAfterPrint)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('beforeprint', onBeforePrint)
  window.removeEventListener('afterprint', onAfterPrint)
})
</script>

<template>
  <div class="deck">
    <div class="stage">
      <div
        v-for="(s, i) in slides"
        :key="i"
        class="slide-page"
        :class="{ active: printing || i === current }"
      >
        <Slide>
          <component :is="s.c" v-bind="s.p" />
        </Slide>
      </div>
    </div>

    <div class="controls">
      <button class="btn-primary" @click="prev">‹</button>
      <span style="color: #fff; font-size: 0.8rem;">{{ current + 1 }} / {{ slides.length }}</span>
      <button class="btn-primary" @click="next">›</button>
      <button class="btn-primary" @click="printPdf">⬇ Scarica PDF</button>
    </div>
  </div>
</template>
