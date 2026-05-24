<script setup lang="ts">
import { computed } from "vue";
import type { PerformanceComputed } from "../types";
import type { ColumnDef } from "../types";
import { TableSlide } from "kit-slides";

const props = defineProps<{
  performance: PerformanceComputed[];
  week: number;
  year: number;
  pageIndicator?: string;
}>();

const num = new Intl.NumberFormat("it-IT");

const columns: ColumnDef[] = [
  { key: "name", label: "Name", align: "left", width: "10%" },
  {
    key: "usage",
    label: "Usage",
    align: "left",
    width: "10%",
    format: (v) => num.format(Number(v)),
    badge: "progress",
  },
  {
    key: "tot",
    label: "Total",
    align: "left",
    width: "10%",
    format: (v) => num.format(Number(v)),
  },
  {
    key: "status",
    label: "Status",
    align: "left",
    width: "10%",
    badge: "status",
  },
  {
    key: "kpi_1",
    label: "KPI 1",
    align: "center",
    width: "10%",
    format: (v) => `${(Number(v) * 100).toFixed(1)}%`,
  },
  {
    key: "kpi_2",
    label: "KPI 2",
    align: "center",
    width: "10%",
    format: (v) => `${(Number(v) * 100).toFixed(1)}%`,
  },
  {
    key: "kpi_3",
    label: "KPI 3",
    align: "center",
    width: "10%",
    format: (v) => `${(Number(v) * 100).toFixed(1)}%`,
  },
  {
    key: "oks",
    label: "OKs",
    align: "center",
    width: "10%",
    format: (v) => num.format(Number(v)),
  },
  {
    key: "draws",
    label: "Draws",
    align: "center",
    width: "10%",
    format: (v) => num.format(Number(v)),
  },
  {
    key: "kos",
    label: "KOs",
    align: "center",
    width: "10%",
    format: (v) => num.format(Number(v)),
  },
];

const data = computed(
  () => props.performance as unknown as Record<string, unknown>[],
);
const meta = computed(() => `W${props.week} · ${props.year}`);
const title = computed(() =>
  props.pageIndicator
    ? `Performance per Area ${props.pageIndicator}`
    : "Performance per Area",
);
</script>

<template>
  <TableSlide
    :title="title"
    :meta="meta"
    :columns="columns"
    :data="data"
  />
</template>
