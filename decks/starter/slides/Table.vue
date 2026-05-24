<script setup lang="ts">
import { WidgetTable } from "kit-slides";
import { useTableData } from "../composables/useTableData";

const { columns, data } = useTableData();
</script>

<template>
  <WidgetTable :columns="columns" :data="data" />
</template>
