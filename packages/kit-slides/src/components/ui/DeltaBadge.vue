<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value?: number | null
  unit?: string
}
const props = withDefaults(defineProps<Props>(), {
  value: null,
  unit: '%',
})

const isNull = computed(() => props.value === null)
const isPositive = computed(() => !isNull.value && (props.value ?? 0) >= 0)

const formatted = computed(() => {
  if (props.value === null || props.value === undefined) return '—'
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
