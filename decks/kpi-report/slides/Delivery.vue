<script setup lang="ts">
import { computed } from "vue";
import { TableSlide } from "../../../index";
import type { ColumnDef } from "../../../index";
import { DeliveryComputed } from "../types";

const props = defineProps<{
  delivery: DeliveryComputed[];
  week: number;
  year: number;
}>();

const num = new Intl.NumberFormat("it-IT");

const columns: ColumnDef[] = [
  { key: "name", label: "Name", align: "left", width: "15%" },
  {
    key: "wip",
    label: "WIP",
    align: "right",
    width: "10%",
    format: (v) => num.format(Number(v)),
  },
  {
    key: "env_a",
    label: "Env A",
    align: "right",
    width: "10%",
    format: (v) => num.format(Number(v)),
  },
  {
    key: "env_b",
    label: "Env B",
    align: "right",
    width: "10%",
    format: (v) => num.format(Number(v)),
  },
  {
    key: "env_c",
    label: "Env C",
    align: "right",
    width: "10%",
    format: (v) => num.format(Number(v)),
  },
  {
    key: "env_d",
    label: "Env D",
    align: "right",
    width: "10%",
    format: (v) => num.format(Number(v)),
  },
  {
    key: "status",
    label: "Status",
    align: "right",
    // width: "15%",
    badge: "status",
  },
];

const data = computed(() => {
  return props.delivery as unknown as Record<string, unknown>[];
});
const meta = computed(() => `W${props.week} · ${props.year}`);
</script>

<template>
  <TableSlide
    title="Deliverables"
    :meta="meta"
    :columns="columns"
    :data="data"
    :max-rows="6"
  />
</template>
