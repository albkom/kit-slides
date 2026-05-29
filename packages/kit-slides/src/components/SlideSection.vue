<script setup lang="ts">
import { computed } from "vue";

interface Props {
  title?: string;
  meta?: string;
  columns?: number;
  gap?: string;
}
const props = withDefaults(defineProps<Props>(), {
  title: "",
  meta: "",
  columns: 4,
  gap: "0rem",
});

const gridStyle = computed(() => ({
  "--bento-cols": String(props.columns),
}));
</script>

<template>
  <div class="slide-section">
    <div class="bento-grid" :style="gridStyle">
      <slot />
    </div>
  </div>
</template>

<style>

</style>