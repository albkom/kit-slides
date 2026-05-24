<script setup lang="ts">
import { computed } from "vue";
import DeltaBadge from "../../ui/DeltaBadge.vue";

interface Props {
  label: string;
  value: string | number;
  subValue?: string | number;
  delta?: number | null;
  deltaUnit?: string;
  align?: "left" | "center" | "right";
}
const props = withDefaults(defineProps<Props>(), {
  subValue: "",
  delta: null,
  deltaUnit: "%",
  align: "left",
});

const showDelta = computed(() => props.delta !== null && props.delta !== undefined);
</script>

<template>
  <div class="metric-block" :class="`align-${props.align}`">
    <div class="metric-label">{{ props.label }}</div>
    <div class="metric-value">{{ props.value }}</div>
    <div v-if="props.subValue !== ''" class="metric-sub">{{ props.subValue }}</div>
    <div v-if="showDelta" class="metric-delta">
      <DeltaBadge :value="props.delta" :unit="props.deltaUnit" />
    </div>
  </div>
</template>

<style scoped>
.metric-block {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
}
.align-center { text-align: center; align-items: center; }
.align-right  { text-align: right;  align-items: flex-end; }
.metric-label {
  font-size: var(--txt-s);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.metric-value {
  font-size: var(--txt-xxl, 2rem);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.1;
}
.metric-sub {
  font-size: var(--txt-s);
  color: var(--text-secondary);
}
.metric-delta {
  margin-top: 0.15rem;
}
</style>
