<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  author?: string
}
withDefaults(defineProps<Props>(), {
  subtitle: '',
  author: '',
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
