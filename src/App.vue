<script setup>
import { useKpiData } from './composables/useKpiData.js'
import SlideDeck from './components/SlideDeck.vue'

const { currentWeek, summary, channels, categories, geoData, isLoading, error } = useKpiData()
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
        Assicurati che i file CSV siano presenti in <code>public/data/</code>
      </p>
    </div>

    <div v-else-if="!summary || !currentWeek" class="state-screen">
      <p>Nessun dato disponibile. Controlla i file CSV.</p>
    </div>

    <SlideDeck
      v-else
      :summary="summary"
      :channels="channels"
      :categories="categories"
      :geo-data="geoData"
      :current-week="currentWeek"
    />
  </div>
</template>
