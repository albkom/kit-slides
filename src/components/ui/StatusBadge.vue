<script setup>
import { computed } from 'vue'

const props = defineProps({
  stato: { type: String, required: true },
})

const LABELS = {
  in_target: 'In target',
  attenzione: 'Attenzione',
  sotto_target: 'Sotto target',
}

const label = computed(() => LABELS[props.stato] ?? props.stato)
</script>

<template>
  <span class="status-badge" :class="stato">{{ label }}</span>
</template>
