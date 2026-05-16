<script setup>
import Slide from './Slide.vue'

defineProps({
  slides: { type: Array, required: true },
})

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
          <component :is="s.component" v-bind="s.props" />
        </Slide>
      </div>
    </div>
  </div>
</template>
