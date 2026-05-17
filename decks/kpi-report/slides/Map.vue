<script setup lang="ts">
import { computed } from 'vue'
import { MapSlide } from '../../../index'
import { alpha2ToNumeric, numericToAlpha2, countryNames } from '../countryData'
import type { GeoDataPoint } from '../../../index'

interface Props {
  geoData?: GeoDataPoint[]
  week: number
  year: number
}
const props = withDefaults(defineProps<Props>(), {
  geoData: () => [],
})

const eur = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

function compact(v: number): string {
  if (v >= 1_000_000) return '€' + (v / 1_000_000).toFixed(1).replace('.', ',') + 'M'
  if (v >= 1_000)     return '€' + Math.round(v / 1_000) + 'K'
  return '€' + Math.round(v)
}

const meta = computed(() => `W${props.week} · ${props.year}`)
</script>

<template>
  <MapSlide
    title="Performance Geografica"
    :meta="meta"
    :data="geoData ?? []"
    :top-count="5"
    :country-names="countryNames"
    :alpha2-to-numeric="alpha2ToNumeric"
    :numeric-to-alpha2="numericToAlpha2"
    :format-value="(v) => eur.format(v)"
    :format-compact="compact"
  />
</template>
