<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, default: null },
  unit: { type: String, default: '%' },
})

const isPositive = computed(() => props.value !== null && props.value >= 0)
const isNull = computed(() => props.value === null)

const formatted = computed(() => {
  if (isNull.value) return '—'
  const sign = props.value >= 0 ? '+' : ''
  return `${sign}${props.value.toFixed(1)}${props.unit}`
})
</script>

<template>
  <span class="delta-badge" :class="isNull ? 'neutral' : isPositive ? 'up' : 'down'">
    <span v-if="!isNull" class="arrow">{{ isPositive ? '▲' : '▼' }}</span>
    {{ formatted }}
  </span>
</template>

<style scoped>
.delta-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
}

.up {
  color: var(--status-ok);
  background: var(--status-ok-bg);
}

.down {
  color: var(--status-bad);
  background: var(--status-bad-bg);
}

.neutral {
  color: var(--text-secondary);
  background: var(--border);
}

.arrow {
  font-size: 0.65rem;
}
</style>
