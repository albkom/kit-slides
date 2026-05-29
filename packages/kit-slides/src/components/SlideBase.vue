<script setup lang="ts">
import { computed, inject } from "vue";
import type { ComputedRef } from "vue";
import SlideTopper from "./SlideTopper.vue";

interface TopperData {
  logo: string | null;
  department: string | null;
}
const _topper = inject<ComputedRef<TopperData>>("slideTopper");
const hasTopper = computed(
  () => !!(_topper?.value?.logo || _topper?.value?.department),
);

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
  gap: "1rem",
});

const gridStyle = computed(() => ({
  "--bento-cols": String(props.columns),
  "--bento-gap": props.gap,
}));

const showHeader = computed(
  () => !!(props.title || props.meta || hasTopper.value),
);
</script>

<template>
  <div class="slide slide-bento">
    <div v-if="showHeader" class="slide-header">
      <h2 v-if="title" class="slide-title">{{ title }}</h2>
      <span v-if="meta" class="slide-meta">{{ meta }}</span>
      <SlideTopper />
    </div>
    <div class="bento-grid" :style="gridStyle">
      <slot />
    </div>
  </div>
</template>
