<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  author: { type: String, default: '' },
})
</script>

<template>
  <div class="slide pitch-cover">
    <div class="pitch-cover-content">
      <h1 class="pitch-title">{{ title }}</h1>
      <p v-if="subtitle" class="pitch-subtitle">{{ subtitle }}</p>
      <p v-if="author" class="pitch-author">— {{ author }}</p>
    </div>
  </div>
</template>
