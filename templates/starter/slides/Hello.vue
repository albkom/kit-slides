<script setup>
defineProps({
  title: { type: String, required: true },
})
</script>

<template>
  <div class="slide hello">
    <h1>{{ title }}</h1>
    <p>Modifica <code>decks/&lt;nome&gt;/slides/Hello.vue</code> per iniziare.</p>
  </div>
</template>
