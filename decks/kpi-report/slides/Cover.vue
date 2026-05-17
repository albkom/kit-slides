<script setup lang="ts">
import { computed } from 'vue'
import { CoverSlide } from '../../../index'

const props = defineProps<{ week: number; year: number; totalSlides?: number | null }>()

const generatedDate = computed(() =>
  new Intl.DateTimeFormat('it-IT', {
    day: '2-digit', month: 'long', year: 'numeric',
  }).format(new Date()),
)

const subtitle = computed(() => `Settimana ${props.week} · ${props.year}`)
const meta     = computed(() => `Generato il ${generatedDate.value}`)
</script>

<template>
  <CoverSlide
    title="Titolo Slideshow"
    badge="Report Settimanale"
    :subtitle="subtitle"
    :meta="meta"
    :total-slides="totalSlides ?? null"
  />
</template>
