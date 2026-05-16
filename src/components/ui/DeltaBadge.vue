<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, default: null },
  unit: { type: String, default: '%' },
})

const isNull = computed(() => props.value === null)
const isPositive = computed(() => !isNull.value && props.value >= 0)

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
