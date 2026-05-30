<script setup lang="ts">
import { ref, computed, onMounted, markRaw } from 'vue'
import { SlideDeck, CoverSlide, type DeckSlide } from 'kit-slides'
import { loadCsv } from './adapters/csvAdapter'
import DataSlide from './slides/DataSlide.vue'

const rows = ref<Record<string, string>[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    rows.value = await loadCsv('./data/items.csv')
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    isLoading.value = false
  }
})

const columns = computed(() =>
  rows.value.length
    ? Object.keys(rows.value[0]).map(k => ({ key: k, label: k }))
    : []
)

const slides = computed<DeckSlide[]>(() => [
  {
    component: markRaw(CoverSlide),
    isCover: true,
    props: { title: 'My Deck', subtitle: 'Data from CSV' },
  },
  {
    component: markRaw(DataSlide),
    props: { title: 'Overview', rows: rows.value, columns: columns.value },
  },
])
</script>

<template>
  <div class="app">
    <div v-if="isLoading" class="state-screen">Loading…</div>
    <div v-else-if="error" class="state-screen error">{{ error }}</div>
    <SlideDeck v-else :slides="slides" />
  </div>
</template>

<style>
body { margin: 0; }
.app { height: 100dvh; display: flex; flex-direction: column; }
.state-screen {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: sans-serif;
  color: #6b7280;
}
.state-screen.error { color: #dc2626; }
</style>
