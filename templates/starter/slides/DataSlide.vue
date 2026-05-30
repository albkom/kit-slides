<script setup lang="ts">
import { SlideBase, BentoCard, WidgetTable, type ColumnDef } from 'kit-slides'

defineProps<{
  title?: string
  rows: Record<string, unknown>[]
  columns: ColumnDef[]
}>()
</script>

<template>
  <SlideBase :title="title">
    <BentoCard size="4x2" eyebrow="Data">
      <WidgetTable :data="rows" :columns="columns" />
    </BentoCard>
  </SlideBase>
</template>
