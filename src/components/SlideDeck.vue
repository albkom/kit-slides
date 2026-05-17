<script setup lang="ts">
import { ref } from 'vue'
import Slide from './Slide.vue'
import type { SlideDefinition } from '../types'

defineProps<{ slides: SlideDefinition[] }>()

const isDocument = ref(localStorage.getItem('slideDeckView') === 'document')

function saveView() {
  localStorage.setItem('slideDeckView', isDocument.value ? 'document' : 'slide')
}

function printPdf() { window.print() }
</script>

<template>
  <div class="deck">
    <div class="toolbar">
      <button class="btn-primary" @click="printPdf">⬇ Scarica PDF</button>
      <label class="toggle-label" aria-label="Modalità documento">
        <input type="checkbox" role="switch" v-model="isDocument" @change="saveView" />
        Infinite scroll
      </label>
    </div>

    <div class="stage" :class="{ 'stage--document': isDocument }">
      <div
        v-for="(s, i) in slides"
        :key="i"
        class="slide-page"
      >
        <Slide :slide-number="i + 1" :total-slides="slides.length">
          <component :is="s.component" v-bind="s.props" />
        </Slide>
      </div>
    </div>
  </div>
</template>
