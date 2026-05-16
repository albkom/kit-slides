<script setup>
defineProps({
  quote: { type: String, required: true },
  attribution: { type: String, default: '' },
})
</script>

<template>
  <div class="slide pitch-quote">
    <blockquote class="pitch-quote-text">
      <span class="pitch-mark">“</span>{{ quote }}<span class="pitch-mark">”</span>
    </blockquote>
    <p v-if="attribution" class="pitch-attribution">— {{ attribution }}</p>
  </div>
</template>
