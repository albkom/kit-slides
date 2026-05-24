<script setup lang="ts">
import { computed } from "vue";
import DeltaBadge from "./DeltaBadge.vue";

export interface DisplayValueMediumProps {
  value: string | number;
  label: string;
  subValue?: string | number;
  delta?: number | null;
  deltaUnit?: string;
  align?: "left" | "center" | "right";
}

const props = withDefaults(defineProps<DisplayValueMediumProps>(), {
  subValue: undefined,
  delta: null,
  deltaUnit: "%",
  align: "left",
});

const showDelta = computed(() => props.delta !== null && props.delta !== undefined);
</script>

<template>
  <div class="display-value-medium" :class="`align-${props.align}`">
    <span class="dvm-label">{{ props.label }}</span>
    <div class="dvm-body">
      <div class="dvm-value">{{ props.value }}</div>
      <DeltaBadge v-if="showDelta" :value="props.delta" :unit="props.deltaUnit" />
    </div>
    <div v-if="props.subValue !== undefined" class="dvm-sub">{{ props.subValue }}</div>
  </div>
</template>

<style scoped>
.display-value-medium {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.align-center { align-items: center; text-align: center; }
.align-right  { align-items: flex-end; text-align: right; }

.dvm-label {
  font-size: var(--txt-s, 0.72rem);
  font-weight: 600;
  color: var(--text-secondary, #64748b);
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.dvm-body {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.dvm-value {
  font-size: var(--txt-xl, 1.75rem);
  font-weight: 700;
  color: var(--text-primary, #0f172a);
  line-height: 1.1;
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
}

.dvm-sub {
  font-size: var(--txt-s, 0.72rem);
  color: var(--text-secondary, #64748b);
}
</style>
