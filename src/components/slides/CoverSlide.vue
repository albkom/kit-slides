<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  badge?: string
  meta?: string
  totalSlides?: number | null
}
const props = withDefaults(defineProps<Props>(), {
  subtitle: '',
  badge: '',
  meta: '',
  totalSlides: null,
})
</script>

<template>
  <div v-if="!props.title" class="slide slide-error">
    Slide "CoverSlide": prop <code>title</code> mancante.
  </div>
  <div v-else class="slide slide-cover">
    <div class="cover-content">
      <div v-if="badge" class="badge">{{ badge }}</div>
      <h1 class="title">{{ title }}</h1>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      <div class="divider" />
      <p v-if="meta" class="generated">{{ meta }}</p>
      <p v-if="totalSlides != null" class="cover-total-slides">{{ totalSlides }} slides</p>
    </div>
    <div class="cover-deco" />
  </div>
</template>
