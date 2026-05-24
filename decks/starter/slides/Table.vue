<script setup lang="ts">
import type { PerformanceComputed } from "../types";
import { WidgetTable } from "kit-slides";
import { useTableData } from "../composables/useTableData";

const props = defineProps<{
  performance: PerformanceComputed[];
}>();

const { columns, data } = useTableData(props);
</script>

<template>
  <WidgetTable :columns="columns" :data="data" />
</template>
