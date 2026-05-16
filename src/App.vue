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

<style scoped>
.app {
  height: 100vh;
  overflow: hidden;
}

.state-screen {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--text-secondary);
  font-size: 1rem;
}

.state-screen.error {
  color: var(--text-primary);
}

.error-icon {
  font-size: 3rem;
}

.error-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--status-bad);
}

.error-detail {
  font-family: monospace;
  font-size: 0.9rem;
  background: #fee2e2;
  color: #991b1b;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.error-hint {
  font-size: 0.85rem;
}

code {
  background: rgba(0, 0, 0, 0.07);
  padding: 0.1em 0.4em;
  border-radius: 4px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--brand-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
