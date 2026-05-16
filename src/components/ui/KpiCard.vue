<script setup>
import DeltaBadge from './DeltaBadge.vue'

defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  delta: { type: Number, default: null },
  icon: { type: String, default: '' },
})
</script>

<template>
  <div class="kpi-card">
    <div class="kpi-header">
      <span v-if="icon" class="kpi-icon">{{ icon }}</span>
      <span class="kpi-label">{{ label }}</span>
    </div>
    <div class="kpi-value">{{ value }}</div>
    <div class="kpi-footer">
      <DeltaBadge :value="delta" />
      <span class="kpi-vs">vs settimana prec.</span>
    </div>
  </div>
</template>

<style scoped>
.kpi-card {
  background: white;
  border-radius: var(--slide-radius);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  border: 1px solid var(--border);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.kpi-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.kpi-icon {
  font-size: 1.1rem;
}

.kpi-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.kpi-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.kpi-footer {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.kpi-vs {
  font-size: 0.72rem;
  color: var(--text-secondary);
}
</style>
