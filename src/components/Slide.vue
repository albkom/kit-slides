<script setup>
import { computed } from 'vue'
import { SLIDE_W, SLIDE_H } from '../composables/useSlideScale.js'

const props = defineProps({
  scale: { type: Number, required: true },
})

const outerStyle = computed(() => ({
  position: 'relative',
  width: `${SLIDE_W * props.scale}px`,
  height: `${SLIDE_H * props.scale}px`,
  overflow: 'hidden',
  flexShrink: '0',
}))

const innerStyle = computed(() => ({
  position: 'absolute',
  top: '0',
  left: '0',
  width: `${SLIDE_W}px`,
  height: `${SLIDE_H}px`,
  transform: `scale(${props.scale})`,
  transformOrigin: 'top left',
}))
</script>

<template>
  <div class="slide-outer" :style="outerStyle">
    <div class="slide-inner" :style="innerStyle">
      <slot />
    </div>
  </div>
</template>

<style scoped>
@media print {
  /*
   * Force each slide to fill exactly one A4 landscape page.
   * The transform on .slide-inner (inline, JS-computed to ~0.877) already
   * fits the 1280×720 content into A4; the outer just needs to be page-sized
   * so page-break-after fires reliably.
   */
  .slide-outer {
    position: relative !important;
    width: 100vw !important;
    height: 100vh !important;
    overflow: hidden !important;
    page-break-after: always !important;
    break-after: page !important;
    /* Avoid Chrome splitting the slide mid-content */
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
}
</style>
