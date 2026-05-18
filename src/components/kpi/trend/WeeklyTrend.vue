<script setup lang="ts">
import { computed } from "vue";

export interface WeeklyPoint {
  week: number;
  value: number;
}

interface Props {
  points: WeeklyPoint[];
  currentWeek: number;
  label?: string;
  formatValue?: (value: number) => string;
}
const props = withDefaults(defineProps<Props>(), {
  label: "",
  formatValue: undefined,
});

const max = computed(() =>
  Math.max(...props.points.map((p) => p.value), 1),
);

function pct(v: number): number {
  return (v / max.value) * 100;
}
function fmt(v: number): string {
  return props.formatValue ? props.formatValue(v) : String(v);
}
</script>

<template>
  <div class="weekly-trend">
    <div v-if="props.label" class="weekly-label">{{ props.label }}</div>
    <div class="weekly-bars">
      <div
        v-for="p in props.points"
        :key="p.week"
        class="weekly-col"
        :class="{ current: p.week === props.currentWeek }"
      >
        <div class="weekly-bar-value">{{ fmt(p.value) }}</div>
        <div class="weekly-bar-track">
          <div class="weekly-bar-fill" :style="{ height: pct(p.value) + '%' }"></div>
        </div>
        <div class="weekly-bar-week">W{{ p.week }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weekly-trend {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}
.weekly-label {
  font-size: var(--txt-s);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.weekly-bars {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  height: 6rem;
}
.weekly-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  height: 100%;
}
.weekly-bar-value {
  font-size: var(--txt-xs, 0.75rem);
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}
.weekly-bar-track {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  background: transparent;
}
.weekly-bar-fill {
  width: 100%;
  background: var(--brand-primary);
  opacity: 0.4;
  border-radius: 2px 2px 0 0;
  transition: height 0.2s ease;
}
.weekly-col.current .weekly-bar-fill {
  opacity: 1;
  background: var(--brand-accent);
}
.weekly-col.current .weekly-bar-value,
.weekly-col.current .weekly-bar-week {
  font-weight: 700;
  color: var(--text-primary);
}
.weekly-bar-week {
  font-size: var(--txt-xs, 0.75rem);
  color: var(--text-secondary);
}
</style>
