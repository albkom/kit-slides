<script setup lang="ts">
import { computed } from 'vue'

defineProps<{ week: number; year: number }>()

const generatedDate = computed(() =>
  new Intl.DateTimeFormat('it-IT', {
    day: '2-digit', month: 'long', year: 'numeric',
  }).format(new Date()),
)
</script>

<template>
  <div class="slide slide-cover">
    <div class="cover-content">
      <div class="badge">Report Settimanale</div>
      <h1 class="title">Titolo Slideshow</h1>
      <p class="subtitle">Settimana {{ week }} · {{ year }}</p>
      <div class="divider" />
      <p class="generated">Generato il {{ generatedDate }}</p>
    </div>
    <div class="cover-deco" />
  </div>
</template>
