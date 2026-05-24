<script setup lang="ts">
import {
  BentoCard,
  SlideSection,
  WidgetTable,
  WidgetMap,
  WidgetPie,
  WidgetHistogram,
  WidgetRadar,
} from "kit-slides";
import { useShowcaseData, formatWithK } from "../composables/useShowcaseData";

const { pieItems, histItems, tableData, columns, geoData, radarItems, radarAxes } =
  useShowcaseData();
</script>

<template>
  <SlideSection :columns="2">
    <BentoCard size="1x1" eyebrow="Ops per area">
      <WidgetPie :data="pieItems" kind="doughnut" :formatValue="formatWithK" />
    </BentoCard>
    <BentoCard size="1x1" eyebrow="Riepilogo KPI">
      <WidgetTable :columns="columns" :data="tableData" :maxRows="5" />
    </BentoCard>
    <BentoCard size="1x1" eyebrow="Distribuzione geografica">
      <WidgetMap :data="geoData" />
    </BentoCard>
    <BentoCard size="1x1" eyebrow="KPI 1 per area">
      <WidgetHistogram :data="histItems" :formatValue="(v) => v.toFixed(0) + '%'" />
    </BentoCard>
    <BentoCard size="2x2" eyebrow="KPI per area — confronto radar">
      <WidgetRadar
        :axes="radarAxes"
        :data="radarItems"
        :formatValue="(v) => v.toFixed(1) + '%'"
        color="#185fa5"
        :showLegend="false"
      />
    </BentoCard>
  </SlideSection>
</template>
