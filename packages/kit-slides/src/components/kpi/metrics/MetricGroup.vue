<script setup lang="ts">
import WidgetMetric from "../../ui/WidgetMetric.vue";

export interface MetricItem {
  label: string;
  value: string | number;
  subValue?: string | number;
  delta?: number | null;
  deltaUnit?: string;
}

interface Props {
  items: MetricItem[];
  columns?: number;
  align?: "left" | "center" | "right";
}
const props = withDefaults(defineProps<Props>(), {
  columns: 0,
  align: "left",
});
</script>

<template>
  <div
    class="metric-group"
    :style="props.columns > 0 ? { gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))` } : undefined"
  >
    <WidgetMetric
      v-for="(item, i) in props.items"
      :key="i"
      :label="item.label"
      :value="item.value"
      :sub-value="item.subValue"
      :delta="item.delta ?? null"
      :delta-unit="item.deltaUnit ?? '%'"
      :align="props.align"
    />
    <slot />
  </div>
</template>

<style scoped>
.metric-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  width: 100%;
}
</style>
