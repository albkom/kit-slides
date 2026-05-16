<script setup>
defineProps({
  heading: { type: String, required: true },
  body: { type: String, required: true },
})
</script>

<template>
  <div class="slide pitch-text">
    <h2 class="pitch-heading">{{ heading }}</h2>
    <p class="pitch-body">{{ body }}</p>
  </div>
</template>
