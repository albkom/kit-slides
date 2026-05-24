<script setup lang="ts">
import {
  BentoCard,
  SlideSection,
  WidgetTable,
  WidgetPie,
  WidgetHistogram,
  WidgetRadar,
  WidgetMetric,
  WidgetBase,
  DeltaBadge,
  DisplayValueBig,
  DisplayValueMedium,
  DisplayValueSmall,
  WidgetList,
} from "kit-slides";
import { useShowcaseData, formatWithK } from "../composables/useShowcaseData";
import { useTargetServer } from "../composables/useTargetServer";

const props = defineProps<{
  serverName: string;
}>();

const { pieItems, histItems, tableData, columns, geoData } = useShowcaseData();

const { pieData, radarAxes, radarData, knownIssues } = useTargetServer(
  props.serverName,
);
</script>

<template>
  <SlideSection :columns="2" :rows="2">
    <BentoCard size="1x1" eyebrow="Server responses per code">
      <WidgetPie :data="pieData" kind="doughnut" :formatValue="formatWithK" />
    </BentoCard>
    <BentoCard size="1x1" eyebrow="Riepilogo KPI">
      <WidgetTable :columns="columns" :data="tableData" :maxRows="5" />
    </BentoCard>
    <BentoCard size="1x1" eyebrow="Performance" :isRow="true">
      <WidgetBase justify="center">
        <DisplayValueBig label="KPI 1" value="100%" />
        <!-- <DeltaBadge :value="0.5" unit="%" /> -->
        <WidgetBase isRow>
          <DisplayValueSmall label="Tier" value="A+" />
          <DisplayValueSmall label="Ver." value="V5" />
          <DisplayValueSmall label="Ops" value="2000" />
        </WidgetBase>
        <DisplayValueSmall label="Performance" value="Buono" color="green" />
        <DisplayValueSmall label="Status*" value="Buono" color="green" />
      </WidgetBase>
      <WidgetRadar :axes="radarAxes" :data="radarData" :showLegend="false" />
    </BentoCard>
    <BentoCard size="1x1" eyebrow="KPI 1 per area">
      <WidgetList :items="knownIssues" />
    </BentoCard>
  </SlideSection>
</template>
