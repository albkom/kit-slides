<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  badge?: string
  meta?: string
  totalSlides?: number | null
}

withDefaults(defineProps<Props>(), {
  subtitle: '',
  badge: '',
  meta: '',
  totalSlides: null,
})
</script>

<template>
  <div class="slide slide-cover">
    <div class="cover-deco" />
    <div class="cover-content">
      <div v-if="badge" class="badge">{{ badge }}</div>
      <div class="title">{{ title }}</div>
      <div class="divider" />
      <div v-if="subtitle" class="subtitle">{{ subtitle }}</div>
      <div v-if="meta" class="generated">{{ meta }}</div>
      <div v-if="totalSlides" class="cover-total-slides">{{ totalSlides }} slides</div>
    </div>
  </div>
</template>
