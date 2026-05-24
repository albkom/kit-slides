<script setup lang="ts">
import { SlideDeck } from '../../index'
import { buildSlides } from './deck'

const slides = buildSlides()
</script>

<template>
  <div class="app">
    <SlideDeck :slides="slides" />
  </div>
</template>
