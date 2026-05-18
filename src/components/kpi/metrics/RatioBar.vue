<script setup lang="ts">
import { computed } from "vue";

interface Props {
  leftLabel: string;
  rightLabel: string;
  leftValue: number;
  rightValue: number;
  formatValue?: (value: number) => string;
}
const props = withDefaults(defineProps<Props>(), {
  formatValue: undefined,
});

const total = computed(() => props.leftValue + props.rightValue);
const leftPct = computed(() =>
  total.value === 0 ? 50 : (props.leftValue / total.value) * 100,
);
const rightPct = computed(() => 100 - leftPct.value);

function fmt(v: number): string {
  return props.formatValue ? props.formatValue(v) : String(v);
}
</script>

<template>
  <div class="ratio-bar">
    <div class="ratio-header">
      <div class="ratio-side left">
        <span class="ratio-label">{{ props.leftLabel }}</span>
        <span class="ratio-value">{{ fmt(props.leftValue) }}</span>
      </div>
      <div class="ratio-side right">
        <span class="ratio-value">{{ fmt(props.rightValue) }}</span>
        <span class="ratio-label">{{ props.rightLabel }}</span>
      </div>
    </div>
    <div class="ratio-track">
      <div class="ratio-fill left-fill" :style="{ width: leftPct + '%' }"></div>
      <div class="ratio-fill right-fill" :style="{ width: rightPct + '%' }"></div>
    </div>
  </div>
</template>

<style scoped>
.ratio-bar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}
.ratio-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
}
.ratio-side {
  display: flex;
  flex-direction: column;
}
.ratio-side.right { align-items: flex-end; }
.ratio-label {
  font-size: var(--txt-s);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.ratio-value {
  font-size: var(--txt-l, 1.5rem);
  font-weight: 700;
  color: var(--text-primary);
}
.ratio-track {
  display: flex;
  height: 0.75rem;
  border-radius: 999px;
  overflow: hidden;
  background: var(--border);
}
.ratio-fill {
  height: 100%;
  transition: width 0.2s ease;
}
.left-fill  { background: var(--brand-primary); }
.right-fill { background: var(--brand-accent); }
</style>
