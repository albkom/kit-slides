<script setup lang="ts">
import { computed } from "vue";
import DeltaBadge from "./DeltaBadge.vue";

export interface DisplayValueBigProps {
  value: string | number;
  label: string;
  subValue?: string | number;
  delta?: number | null;
  deltaUnit?: string;
  align?: "left" | "center" | "right";
}

const props = withDefaults(defineProps<DisplayValueBigProps>(), {
  subValue: undefined,
  delta: null,
  deltaUnit: "%",
  align: "left",
});

const showDelta = computed(() => props.delta !== null && props.delta !== undefined);
</script>

<template>
  <div class="display-value-big" :class="`align-${props.align}`">
    <span class="dvb-label">{{ props.label }}</span>
    <div class="dvb-value">{{ props.value }}</div>
    <div v-if="props.subValue !== undefined" class="dvb-sub">{{ props.subValue }}</div>
    <div v-if="showDelta" class="dvb-delta">
      <DeltaBadge :value="props.delta" :unit="props.deltaUnit" />
    </div>
  </div>
</template>

<style scoped>
.display-value-big {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.align-center { align-items: center; text-align: center; }
.align-right  { align-items: flex-end; text-align: right; }

.dvb-label {
  font-size: var(--txt-s, 0.72rem);
  font-weight: 600;
  color: var(--text-secondary, #64748b);
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.dvb-value {
  font-size: var(--txt-3xl, 3rem);
  font-weight: 800;
  color: var(--text-primary, #0f172a);
  line-height: 1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.dvb-sub {
  font-size: var(--txt-s, 0.72rem);
  color: var(--text-secondary, #64748b);
  margin-top: 0.1rem;
}

.dvb-delta {
  margin-top: 0.25rem;
}
</style>
