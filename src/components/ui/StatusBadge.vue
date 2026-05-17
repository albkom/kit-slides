<script setup lang="ts">
import { computed } from 'vue'
import type { KpiStato } from '../../types'

const props = defineProps<{ stato: KpiStato }>()

const LABELS: Record<KpiStato, string> = {
  in_target: 'In target',
  attenzione: 'Attenzione',
  sotto_target: 'Sotto target',
}

const label = computed(() => LABELS[props.stato] ?? props.stato)
</script>

<template>
  <span class="status-badge" :class="stato">{{ label }}</span>
</template>
