<script setup lang="ts">
interface Props {
  isRow?: boolean;
  gap?: string;
  align?: string;
  justify?: string;
  wrap?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isRow: false,
  gap: "0.75rem",
  align: undefined,
  justify: undefined,
  wrap: false,
});
</script>

<template>
  <div
    class="widget-base"
    :class="{ 'widget-base--row': props.isRow, 'widget-base--wrap': props.wrap }"
    :style="{
      gap: props.gap,
      alignItems: props.align,
      justifyContent: props.justify,
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.widget-base {
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
}

.widget-base--row {
  flex-direction: row;
}

.widget-base--wrap {
  flex-wrap: wrap;
}
</style>
