<script setup lang="ts">
import { computed } from "vue";

export interface BarItem {
  label: string;
  value: number;
  color?: string;
}

interface Props {
  items: BarItem[];
  max?: number;
  formatValue?: (value: number) => string;
}
const props = withDefaults(defineProps<Props>(), {
  max: 0,
  formatValue: undefined,
});

const effectiveMax = computed(() => {
  if (props.max > 0) return props.max;
  return Math.max(...props.items.map((i) => i.value), 1);
});

function pct(value: number): number {
  return (value / effectiveMax.value) * 100;
}
function fmt(v: number): string {
  return props.formatValue ? props.formatValue(v) : String(v);
}
</script>

<template>
  <div class="bar-comparison">
    <div v-for="(item, i) in props.items" :key="i" class="bar-row">
      <span class="bar-label">{{ item.label }}</span>
      <div class="bar-track">
        <div
          class="bar-fill"
          :style="{
            width: pct(item.value) + '%',
            background: item.color ?? 'var(--brand-primary)',
          }"
        ></div>
      </div>
      <span class="bar-value">{{ fmt(item.value) }}</span>
    </div>
  </div>
</template>

<style scoped>
.bar-comparison {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}
.bar-row {
  display: grid;
  grid-template-columns: minmax(6rem, max-content) 1fr auto;
  align-items: center;
  gap: 0.75rem;
}
.bar-label {
  font-size: var(--txt-s);
  color: var(--text-primary);
  font-weight: 600;
}
.bar-track {
  height: 0.65rem;
  background: var(--border);
  border-radius: 999px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  transition: width 0.2s ease;
}
.bar-value {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 3rem;
  text-align: right;
}
</style>
