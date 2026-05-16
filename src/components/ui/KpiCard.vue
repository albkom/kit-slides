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
