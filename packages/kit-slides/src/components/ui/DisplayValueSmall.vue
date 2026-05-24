<script setup lang="ts">
import { computed } from "vue";
import DeltaBadge from "./DeltaBadge.vue";

export interface DisplayValueSmallProps {
  value: string | number;
  label: string;
  subValue?: string | number;
  delta?: number | null;
  deltaUnit?: string;
  align?: "left" | "center" | "right";
}

const props = withDefaults(defineProps<DisplayValueSmallProps>(), {
  subValue: undefined,
  delta: null,
  deltaUnit: "%",
  align: "left",
});

const showDelta = computed(() => props.delta !== null && props.delta !== undefined);
</script>

<template>
  <div class="display-value-small" :class="`align-${props.align}`">
    <span class="dvs-label">{{ props.label }}</span>
    <div class="dvs-row">
      <span class="dvs-value">{{ props.value }}</span>
      <span v-if="props.subValue !== undefined" class="dvs-sub">{{ props.subValue }}</span>
      <DeltaBadge v-if="showDelta" :value="props.delta" :unit="props.deltaUnit" />
    </div>
  </div>
</template>

<style scoped>
.display-value-small {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.align-center { align-items: center; text-align: center; }
.align-right  { align-items: flex-end; text-align: right; }

.dvs-label {
  font-size: var(--txt-xs, 0.65rem);
  font-weight: 600;
  color: var(--text-secondary, #64748b);
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.dvs-row {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.dvs-value {
  font-size: var(--txt-m, 1.1rem);
  font-weight: 700;
  color: var(--text-primary, #0f172a);
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}

.dvs-sub {
  font-size: var(--txt-xs, 0.65rem);
  color: var(--text-secondary, #64748b);
}
</style>
