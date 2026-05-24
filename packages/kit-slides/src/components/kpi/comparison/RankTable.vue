<script setup lang="ts">
import { computed } from "vue";
import DeltaBadge from "../../ui/DeltaBadge.vue";

export interface RankRow {
  label: string;
  value: number;
  delta?: number | null;
  sub?: string;
}

interface Props {
  rows: RankRow[];
  title?: string;
  maxRows?: number;
  formatValue?: (value: number) => string;
  showRank?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  title: "",
  maxRows: 0,
  formatValue: undefined,
  showRank: true,
});

const visibleRows = computed(() =>
  props.maxRows > 0 ? props.rows.slice(0, props.maxRows) : props.rows,
);

function fmt(v: number): string {
  return props.formatValue ? props.formatValue(v) : String(v);
}
</script>

<template>
  <div class="rank-table">
    <h3 v-if="props.title" class="rank-title">{{ props.title }}</h3>
    <ol class="rank-list">
      <li v-for="(row, i) in visibleRows" :key="i" class="rank-row">
        <span v-if="props.showRank" class="rank-index">{{ i + 1 }}</span>
        <div class="rank-body">
          <div class="rank-label">{{ row.label }}</div>
          <div v-if="row.sub" class="rank-sub">{{ row.sub }}</div>
        </div>
        <div class="rank-value">{{ fmt(row.value) }}</div>
        <div v-if="row.delta !== undefined" class="rank-delta">
          <DeltaBadge :value="row.delta ?? null" />
        </div>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.rank-table { width: 100%; }
.rank-title {
  margin: 0 0 0.5rem 0;
  font-size: var(--txt-m, 1rem);
  color: var(--text-primary);
}
.rank-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.rank-row {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--border);
}
.rank-index {
  font-weight: 700;
  color: var(--brand-primary);
  min-width: 1.5rem;
  text-align: right;
}
.rank-body { min-width: 0; }
.rank-label { font-weight: 600; color: var(--text-primary); }
.rank-sub   { font-size: var(--txt-s); color: var(--text-secondary); }
.rank-value { font-variant-numeric: tabular-nums; font-weight: 600; }
</style>
