<script setup lang="ts">
import type { KpiChannel, KpiAreaComputed } from "../types";
import type { GeoDataPoint } from "kit-slides";
import {
  BentoCard,
  SlideSection,
  WidgetTable,
  WidgetMap,
  WidgetPie,
  WidgetHistogram,
} from "kit-slides";
import { useShowcaseData, formatWithK } from "../composables/useShowcaseData";

const props = withDefaults(
  defineProps<{
    geoData?: GeoDataPoint[];
    areas: KpiAreaComputed[];
    channels?: KpiChannel[];
    week: number;
    year: number;
  }>(),
  { channels: () => [] },
);

const { pieItems, histItems, tableData, columns } = useShowcaseData(props);
</script>

<template>
  <SlideSection :columns="2" :rows="2">
    <BentoCard size="1x1" eyebrow="Ops per area">
      <WidgetPie :data="pieItems" kind="doughnut" :formatValue="formatWithK" />
    </BentoCard>
    <BentoCard size="1x1" eyebrow="Riepilogo KPI">
      <WidgetTable :columns="columns" :data="tableData" :maxRows="5" />
    </BentoCard>
    <BentoCard size="1x1" eyebrow="Distribuzione geografica">
      <WidgetMap :data="props.geoData ?? []" />
    </BentoCard>
    <BentoCard size="1x1" eyebrow="KPI 1 per area">
      <WidgetHistogram :data="histItems" :formatValue="(v) => v.toFixed(0) + '%'" />
    </BentoCard>
  </SlideSection>
</template>
