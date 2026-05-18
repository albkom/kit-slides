<script setup lang="ts">
import { computed } from "vue";

interface Props {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  width: 120,
  height: 32,
  stroke: "var(--brand-primary)",
  fill: false,
});

const path = computed(() => {
  if (props.values.length < 2) return "";
  const min = Math.min(...props.values);
  const max = Math.max(...props.values);
  const range = max - min || 1;
  const stepX = props.width / (props.values.length - 1);
  return props.values
    .map((v, i) => {
      const x = i * stepX;
      const y = props.height - ((v - min) / range) * props.height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
});

const areaPath = computed(() => {
  if (!props.fill || !path.value) return "";
  return `${path.value} L${props.width},${props.height} L0,${props.height} Z`;
});
</script>

<template>
  <svg
    class="sparkline"
    :width="props.width"
    :height="props.height"
    :viewBox="`0 0 ${props.width} ${props.height}`"
    preserveAspectRatio="none"
  >
    <path v-if="props.fill" :d="areaPath" :fill="props.stroke" opacity="0.15" />
    <path :d="path" :stroke="props.stroke" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<style scoped>
.sparkline { display: inline-block; vertical-align: middle; }
</style>
