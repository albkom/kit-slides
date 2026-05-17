<script setup lang="ts">
interface Props {
  quote: string
  attribution?: string
}
withDefaults(defineProps<Props>(), {
  attribution: '',
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
