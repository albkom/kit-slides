<script setup>
import { computed } from 'vue'

const props = defineProps({
  stato: { type: String, required: true },
})

const label = computed(() => {
  const map = {
    in_target: 'In target',
    attenzione: 'Attenzione',
    sotto_target: 'Sotto target',
  }
  return map[props.stato] ?? props.stato
})
</script>

<template>
  <span class="status-badge" :class="stato">{{ label }}</span>
</template>

<style scoped>
.status-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.in_target {
  color: var(--status-ok);
  background: var(--status-ok-bg);
}

.attenzione {
  color: var(--status-warn);
  background: var(--status-warn-bg);
}

.sotto_target {
  color: var(--status-bad);
  background: var(--status-bad-bg);
}
</style>
