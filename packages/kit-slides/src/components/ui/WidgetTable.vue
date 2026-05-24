<script setup lang="ts">
import { computed } from "vue";
import DeltaBadge from "./DeltaBadge.vue";
import StatusBadge from "./StatusBadge.vue";
import ProgressBadge from "./ProgressBadge.vue";
import type { ColumnDef, Status } from "../../types";

interface Props {
  data: Record<string, unknown>[];
  columns: ColumnDef[];
  maxRows?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxRows: 0,
});

const rows = computed(() =>
  props.maxRows > 0 ? props.data.slice(0, props.maxRows) : props.data,
);

function cellText(col: ColumnDef, row: Record<string, unknown>): string {
  const raw = row[col.key];
  if (col.format) return col.format(raw, row);
  if (raw == null) return "";
  return String(raw);
}
</script>

<template>
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :style="{
              textAlign: col.align ?? 'left',
              width: col.width,
            }"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in rows" :key="i">
          <td
            v-for="col in columns"
            :key="col.key"
            :style="{ textAlign: col.align ?? 'left' }"
            :class="{
              'cat-name': col.align !== 'right' && col.align !== 'center',
            }"
          >
            <DeltaBadge
              v-if="col.badge === 'delta'"
              :value="(row[col.key] as number | null | undefined) ?? null"
            />
            <StatusBadge
              v-else-if="col.badge === 'status'"
              :stato="(row[col.key] as Status) ?? 'GOOD'"
            />
            <ProgressBadge
              v-else-if="col.badge === 'progress'"
              :progress="(row[col.key] as number | null | undefined) ?? null"
            />
            <template v-else>{{ cellText(col, row) }}</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
