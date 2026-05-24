<script setup lang="ts">
import { SlideDeck } from '../index'
import { buildSlides } from '__kit_deck__/deck'
const slides = buildSlides()
</script>

<template>
  <div class="app">
    <SlideDeck :slides="slides" />
  </div>
</template>
