<script setup lang="ts">
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
