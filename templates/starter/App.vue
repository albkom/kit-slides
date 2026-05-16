<script setup>
import { SlideDeck } from '../../index.js'
import { buildSlides } from './deck.js'

const slides = buildSlides()
</script>

<template>
  <div class="app">
    <SlideDeck :slides="slides" />
  </div>
</template>
