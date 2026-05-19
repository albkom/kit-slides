<script setup lang="ts">
import { computed } from 'vue'
import { CoverSlide } from '../../../index'

interface Props {
  week: number
  year: number
  title: string
  subtitle?: string
  badge?: string
  totalSlides?: number | null
}
const props = withDefaults(defineProps<Props>(), {
  subtitle: '',
  badge: '',
  totalSlides: null,
})

const generatedDate = computed(() =>
  new Intl.DateTimeFormat('it-IT', {
    day: '2-digit', month: 'long', year: 'numeric',
  }).format(new Date()),
)

const subtitleLine = computed(() => {
  const week = `Settimana ${props.week} · ${props.year}`
  return props.subtitle ? `${props.subtitle} · ${week}` : week
})
const meta = computed(() => `Generato il ${generatedDate.value}`)
</script>

<template>
  <CoverSlide
    :title="title"
    :badge="badge"
    :subtitle="subtitleLine"
    :meta="meta"
    :total-slides="totalSlides ?? null"
  />
</template>
