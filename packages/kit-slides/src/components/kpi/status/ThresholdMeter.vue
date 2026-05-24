<script setup lang="ts">
import { computed } from "vue";
import type { Status } from "../../../types";

interface Props {
  value: number;
  min?: number;
  max: number;
  warnAt: number;
  badAt: number;
  label?: string;
  formatValue?: (value: number) => string;
}
const props = withDefaults(defineProps<Props>(), {
  min: 0,
  label: "",
  formatValue: undefined,
});

const status = computed<Status>(() => {
  if (props.value <= props.badAt) return "BAD";
  if (props.value <= props.warnAt) return "WARNING";
  return "GOOD";
});

const range = computed(() => Math.max(props.max - props.min, 1));
function pct(v: number): number {
  return Math.max(0, Math.min(100, ((v - props.min) / range.value) * 100));
}

const valuePct = computed(() => pct(props.value));
const badPct = computed(() => pct(props.badAt));
const warnPct = computed(() => pct(props.warnAt));

function fmt(v: number): string {
  return props.formatValue ? props.formatValue(v) : String(v);
}
</script>

<template>
  <div class="threshold-meter">
    <div class="threshold-header">
      <span v-if="props.label" class="threshold-label">{{ props.label }}</span>
      <span class="threshold-value" :class="`status-${status.toLowerCase()}`">
        {{ fmt(props.value) }}
      </span>
    </div>
    <div class="threshold-track">
      <div class="zone zone-bad"  :style="{ width: badPct + '%' }"></div>
      <div class="zone zone-warn" :style="{ width: (warnPct - badPct) + '%' }"></div>
      <div class="zone zone-good" :style="{ width: (100 - warnPct) + '%' }"></div>
      <div class="needle" :style="{ left: valuePct + '%' }"></div>
    </div>
    <div class="threshold-scale">
      <span>{{ fmt(props.min) }}</span>
      <span>{{ fmt(props.max) }}</span>
    </div>
  </div>
</template>

<style scoped>
.threshold-meter { width: 100%; display: flex; flex-direction: column; gap: 0.35rem; }
.threshold-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.threshold-label {
  font-size: var(--txt-s);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.threshold-value {
  font-size: var(--txt-l, 1.5rem);
  font-weight: 700;
}
.status-good    { color: var(--status-ok); }
.status-warning { color: var(--status-warn); }
.status-bad     { color: var(--status-bad); }

.threshold-track {
  position: relative;
  display: flex;
  height: 0.6rem;
  border-radius: 999px;
  overflow: hidden;
}
.zone-bad  { background: var(--status-bad-bg); }
.zone-warn { background: var(--status-warn-bg); }
.zone-good { background: var(--status-ok-bg); }
.needle {
  position: absolute;
  top: -0.15rem;
  width: 2px;
  height: calc(100% + 0.3rem);
  background: var(--text-primary);
  transform: translateX(-1px);
}
.threshold-scale {
  display: flex;
  justify-content: space-between;
  font-size: var(--txt-xs, 0.75rem);
  color: var(--text-secondary);
}
</style>
