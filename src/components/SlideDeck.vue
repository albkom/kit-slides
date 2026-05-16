<script setup>
import { ref, nextTick, onMounted, onUnmounted } from "vue";
import {
  SLIDE_W,
  SLIDE_H,
  useSlideScale,
} from "../composables/useSlideScale.js";
import Slide from "./Slide.vue";
import SlideCover from "./slides/SlideCover.vue";
import SlideKpi from "./slides/SlideKpi.vue";
import SlideChart from "./slides/SlideChart.vue";
import SlideTable from "./slides/SlideTable.vue";
import SlideMap from "./slides/SlideMap.vue";

const props = defineProps({
  summary: { type: Object, required: true },
  channels: { type: Array, required: true },
  categories: { type: Array, required: true },
  geoData: { type: Array, default: () => [] },
  currentWeek: { type: Object, required: true },
});

const { container, scale } = useSlideScale();

// A4 landscape (297 × 210 mm) at CSS reference pixel density (96 px/in)
const MM_TO_PX = 96 / 25.4;
const PRINT_SCALE = Math.min(
  (297 * MM_TO_PX) / SLIDE_W,
  (210 * MM_TO_PX) / SLIDE_H,
);

const totalSlides = 5;
const current = ref(0);

function prev() {
  if (current.value > 0) current.value--;
}

function next() {
  if (current.value < totalSlides - 1) current.value++;
}

function onKey(e) {
  if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
  if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
}

async function printPdf() {
  await nextTick(); // ensure DOM reflects PRINT_SCALE before browser captures layout
  window.print();
}

onMounted(() => window.addEventListener("keydown", onKey));
onUnmounted(() => window.removeEventListener("keydown", onKey));
</script>

<template>
  <div class="deck-root">
    <!-- Screen view -->
    <div ref="container" class="deck-container">
      <div class="slides-viewport">
        <Slide :scale="scale">
          <SlideMap
            :geo-data="geoData"
            :week="currentWeek.week"
            :year="currentWeek.year"
          />
        </Slide>
        <!-- <Slide :scale="scale"><SlideCover :week="currentWeek.week" :year="currentWeek.year" /></Slide> -->
        <Slide :scale="scale">
          <SlideKpi
            :summary="summary"
            :week="currentWeek.week"
            :year="currentWeek.year"
          />
        </Slide>
        <Slide :scale="scale">
          <SlideChart
            :channels="channels"
            :week="currentWeek.week"
            :year="currentWeek.year"
          />
        </Slide>
        <Slide :scale="scale">
          <SlideTable
            :categories="categories"
            :week="currentWeek.week"
            :year="currentWeek.year"
          />
        </Slide>
      </div>
    </div>

    <!-- Controls -->
    <div class="controls">
      <button class="pdf-btn" @click="printPdf">⬇ Scarica PDF</button>
    </div>

    <!-- Print view: all slides stacked -->
    <div class="print-deck">
      <Slide :scale="PRINT_SCALE">
        <SlideCover :week="currentWeek.week" :year="currentWeek.year" />
      </Slide>
      <Slide :scale="PRINT_SCALE">
        <SlideKpi
          :summary="summary"
          :week="currentWeek.week"
          :year="currentWeek.year"
        />
      </Slide>
      <Slide :scale="PRINT_SCALE">
        <SlideChart
          :channels="channels"
          :week="currentWeek.week"
          :year="currentWeek.year"
        />
      </Slide>
      <Slide :scale="PRINT_SCALE">
        <SlideTable
          :categories="categories"
          :week="currentWeek.week"
          :year="currentWeek.year"
        />
      </Slide>
      <Slide :scale="PRINT_SCALE">
        <SlideMap :week="currentWeek.week" :year="currentWeek.year" />
      </Slide>
    </div>
  </div>
</template>

<style scoped>
.deck-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.deck-container {
  flex: 1;
  overflow: hidden;
  position: relative;
  min-height: 0;
}

.slides-viewport {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0;
  overflow: auto;
  min-height: 100%;
  height: 100%;
  max-height: 100%;
}

.controls {
  height: 56px;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-shrink: 0;
}

.pdf-btn {
  background: var(--brand-primary);
  border: none;
  color: white;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.45rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}

.pdf-btn:hover {
  background: var(--brand-dark);
}

.print-deck {
  display: none;
}

@media print {
  .deck-container,
  .controls {
    display: none !important;
  }

  .print-deck {
    display: block;
  }
}
</style>
