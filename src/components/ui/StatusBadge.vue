<script setup lang="ts">
import { computed } from 'vue'
import type { KpiStato } from '../../types'
import { Status } from '../../../decks/kpi-report/types';

const props = defineProps<{ stato: Status }>()

const LABELS: Record<Status, string> = {
  GOOD: 'Good',
  ACCEPTABLE: 'Acceptable',
  WARNING: 'Warning',
  BAD: 'Bad',
}

const label = computed(() => LABELS[props.stato] ?? props.stato)
</script>

<template>
  <span class="status-badge" :class="props.stato.toLowerCase()">{{ label }}</span>
</template>
