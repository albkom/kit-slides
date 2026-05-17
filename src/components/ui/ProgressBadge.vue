<script setup lang="ts">
import { computed } from 'vue'
import type { KpiStato } from '../../types'
import { Status } from '../../../decks/kpi-report/types';

const props = defineProps<{ progress: number | null }>()

</script>

<template>
  <span class="progress-badge">
    <span
      v-if="props.progress != null"
      class="progress-fill"
      :style="{ width: props.progress * 100 + '%' }"
    ></span>
  </span>
</template>
