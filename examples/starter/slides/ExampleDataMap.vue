<script setup lang="ts">
import { computed } from 'vue'
import {
  SlideBase,
  BentoCard,
  WidgetTable,
  WidgetMap,
  WidgetList,
} from 'kit-slides'
import type { ListItem } from 'kit-slides'
import { useTableData } from '../composables/useTableData'
import { geoData, performance } from '../composables/useDashboardStore'

const { columns, data } = useTableData()

const alerts = computed<ListItem[]>(() =>
  performance.value
    .filter((p) => p.status === 'BAD' || p.status === 'WARNING')
    .slice(0, 6)
    .map((p) => ({
      text: `${p.name}: KPI 1 at ${(p.kpi_1 * 100).toFixed(1)}%`,
      tone: p.status === 'BAD' ? 'danger' : 'warning',
      badge: p.status,
    })),
)
</script>

<template>
  <SlideBase :columns="2">
    <BentoCard size="1x2" eyebrow="Server performance">
      <WidgetTable :columns="columns" :data="data" :maxRows="8" />
    </BentoCard>

    <BentoCard size="1x1" eyebrow="Geographic distribution">
      <WidgetMap :data="geoData" />
    </BentoCard>

    <BentoCard size="1x1" eyebrow="Alerts">
      <WidgetList :items="alerts" />
    </BentoCard>
  </SlideBase>
</template>
