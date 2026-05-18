<script setup lang="ts">
import type { Status } from "../../../types";

export interface StatusItem {
  label: string;
  status: Status;
  sub?: string;
}

interface Props {
  items: StatusItem[];
  columns?: number;
}
const props = withDefaults(defineProps<Props>(), {
  columns: 0,
});
</script>

<template>
  <div
    class="status-grid"
    :style="props.columns > 0 ? { gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))` } : undefined"
  >
    <div
      v-for="(item, i) in props.items"
      :key="i"
      class="status-cell"
      :class="`status-${item.status.toLowerCase()}`"
    >
      <span class="status-dot"></span>
      <div class="status-body">
        <div class="status-label">{{ item.label }}</div>
        <div v-if="item.sub" class="status-sub">{{ item.sub }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
  width: 100%;
}
.status-cell {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--surface);
}
.status-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 999px;
  flex-shrink: 0;
}
.status-body { min-width: 0; }
.status-label { font-weight: 600; color: var(--text-primary); }
.status-sub   { font-size: var(--txt-s); color: var(--text-secondary); }

.status-good      .status-dot { background: var(--status-ok); }
.status-acceptable .status-dot { background: var(--status-ok); opacity: 0.6; }
.status-warning   .status-dot { background: var(--status-warn); }
.status-bad       .status-dot { background: var(--status-bad); }
</style>
