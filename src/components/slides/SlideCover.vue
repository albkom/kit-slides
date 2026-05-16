<script setup>
import { computed } from 'vue'

const props = defineProps({
  week: { type: Number, required: true },
  year: { type: Number, required: true },
})

const generatedDate = computed(() => {
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date())
})
</script>

<template>
  <div class="slide slide-cover">
    <div class="cover-content">
      <div class="badge">Report Settimanale</div>
      <h1 class="title">KPI Dashboard</h1>
      <p class="subtitle">Settimana {{ week }} · {{ year }}</p>
      <div class="divider" />
      <p class="generated">Generato il {{ generatedDate }}</p>
    </div>
    <div class="cover-deco" />
  </div>
</template>

<style scoped>
.slide-cover {
  background: linear-gradient(135deg, var(--brand-dark) 0%, var(--brand-primary) 60%, #2d7dd2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.cover-content {
  text-align: center;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.badge {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.35rem 1rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.title {
  font-size: 4.5rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 1.6rem;
  font-weight: 400;
  opacity: 0.85;
}

.divider {
  width: 60px;
  height: 3px;
  background: var(--brand-accent);
  border-radius: 2px;
  margin: 0.5rem 0;
}

.generated {
  font-size: 0.9rem;
  opacity: 0.65;
}

.cover-deco {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  border: 80px solid rgba(255, 255, 255, 0.06);
  right: -150px;
  top: -150px;
  pointer-events: none;
}
</style>
