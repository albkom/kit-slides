<script setup lang="ts">
import { ref, computed } from 'vue'
import SlideBase from './SlideBase.vue'
import type { SlideDefinition } from '../types'

const props = defineProps<{
  slides: SlideDefinition[]
  logo?: string
  department?: string
  deckNote?: string
}>()

const isDocument = ref(localStorage.getItem('slideDeckView') === 'document')

function saveView() {
  localStorage.setItem('slideDeckView', isDocument.value ? 'document' : 'slide')
}

function printPdf() { window.print() }

const contentCount = computed(() => props.slides.filter(s => !s.isCover).length)

function slideNumber(s: SlideDefinition, i: number): number | null {
  if (s.isCover) return null
  return props.slides.slice(0, i).filter(x => !x.isCover).length + 1
}

function mergedProps(s: SlideDefinition): Record<string, unknown> {
  if (s.isCover) return { ...s.props, totalSlides: contentCount.value }
  return s.props
}
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
        <SlideBase
          :title="s.title"
          :slide-number="slideNumber(s, i)"
          :total-slides="s.isCover ? null : contentCount"
          :is-cover="s.isCover ?? false"
          :deck-note="props.deckNote ?? null"
          :note="s.note ?? null"
          :logo="props.logo ?? null"
          :department="props.department ?? null"
        >
          <component :is="s.component" v-bind="mergedProps(s)" />
        </SlideBase>
      </div>
    </div>
  </div>
</template>
