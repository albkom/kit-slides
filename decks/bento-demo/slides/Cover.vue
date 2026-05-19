<script setup lang="ts">
import { computed } from 'vue'
import { CoverSlide } from '../../../index'

interface Props {
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

const generated = computed(() =>
  new Intl.DateTimeFormat('it-IT', {
    day: '2-digit', month: 'long', year: 'numeric',
  }).format(new Date()),
)
const meta = computed(() => `Generato il ${generated.value}`)
</script>

<template>
  <CoverSlide
    :title="title"
    :subtitle="subtitle"
    :badge="badge"
    :meta="meta"
    :total-slides="totalSlides ?? null"
  />
</template>
