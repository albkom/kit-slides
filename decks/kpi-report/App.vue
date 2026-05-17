<script setup lang="ts">
import { computed } from 'vue'
import { SlideDeck } from '../../index'
import { useKpiData } from './useKpiData'
import { buildSlides } from './deck'
import { createAdapter } from './adapters/index'
import type { AdapterType } from './adapters/index'

const adapter = createAdapter(
  (import.meta.env.VITE_DATA_SOURCE as AdapterType | undefined) ?? 'csv',
  {
    basePath: (import.meta.env.VITE_CSV_PATH as string | undefined) ?? './data',
    baseUrl:  (import.meta.env.VITE_API_BASE as string | undefined) ?? '',
    port:     Number((import.meta.env.VITE_LOCAL_PORT as string | undefined) ?? 5000),
  },
)

const {
  currentWeek, areas, delivery, channels, categories, geoData, isLoading, error,
} = useKpiData(adapter)

const slides = computed(() =>
  currentWeek.value && areas.value
    ? buildSlides({
        areas: areas.value,
        delivery: delivery.value || [],
        channels: channels.value,
        categories: categories.value,
        geoData: geoData.value,
        week: currentWeek.value.week,
        year: currentWeek.value.year,
      })
    : []
)
</script>

<template>
  <div class="app">
    <div v-if="isLoading" class="state-screen">
      <div class="spinner" />
      <p>Caricamento dati in corso…</p>
    </div>

    <div v-else-if="error" class="state-screen error">
      <div class="error-icon">⚠️</div>
      <p class="error-title">Errore nel caricamento dei dati</p>
      <p class="error-detail">{{ error }}</p>
      <p class="error-hint">
        Assicurati che i file CSV siano presenti in <code>decks/kpi-report/public/data/</code>
      </p>
    </div>

    <div v-else-if="!slides.length" class="state-screen">
      <p>Nessun dato disponibile. Controlla i file CSV.</p>
    </div>

    <SlideDeck v-else :slides="slides" />
  </div>
</template>
