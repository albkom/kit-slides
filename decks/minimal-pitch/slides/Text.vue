<script setup lang="ts">
defineProps<{ heading: string; body: string }>()
</script>

<template>
  <div class="slide pitch-text">
    <h2 class="pitch-heading">{{ heading }}</h2>
    <p class="pitch-body">{{ body }}</p>
  </div>
</template>
