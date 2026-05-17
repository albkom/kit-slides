<script setup lang="ts">
import { inject, computed } from "vue";
import type { ComputedRef } from "vue";
import DeltaBadge from "../ui/DeltaBadge.vue";
import StatusBadge from "../ui/StatusBadge.vue";
import SlideTopper from "../SlideTopper.vue";
import type { ColumnDef, KpiStato } from "../../types";
import { Status } from "../../../decks/kpi-report/types";
import ProgressBadge from "../ui/ProgressBadge.vue";

interface TopperData { logo: string | null; department: string | null }
const _topper = inject<ComputedRef<TopperData>>("slideTopper")
const hasTopper = computed(() => !!(_topper?.value?.logo || _topper?.value?.department))

interface Props {
  data: Record<string, unknown>[];
  columns: ColumnDef[];
  title?: string;
  meta?: string;
  maxRows?: number;
}
const props = withDefaults(defineProps<Props>(), {
  title: "",
  meta: "",
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
  <div
    v-if="
      !props.data ||
      !props.data.length ||
      !props.columns ||
      !props.columns.length
    "
    class="slide slide-error"
  >
    Slide "TableSlide": prop <code>data</code> o <code>columns</code> mancante o
    vuota.
  </div>
  <div v-else class="slide slide-table">
    <div v-if="title || meta || hasTopper" class="slide-header">
      <h2 v-if="title" class="slide-title">{{ title }}</h2>
      <SlideTopper />
    </div>
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
  </div>
</template>
