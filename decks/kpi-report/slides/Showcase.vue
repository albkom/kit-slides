<script setup lang="ts">
import { computed, ref } from "vue";
import type { KpiChannel, KpiAreaComputed, KpiCardDef, ColumnDef, GeoDataPoint } from "../types";
import type { ChartData } from "chart.js";
import {
  BentoCard,
  DeltaBadge,
  SlideSection,
  WidgetTable,
  WidgetMap,
  WidgetPie,
  WidgetHistogram,
} from "kit-slides";
import type { PieItem, HistogramItem } from "kit-slides";

interface Props {
  geoData?: GeoDataPoint[];
  areas: KpiAreaComputed[];
  channels?: KpiChannel[];
  week: number;
  year: number;
}
const props = withDefaults(defineProps<Props>(), {
  channels: () => [],
});

const PIE_COLORS = [
  "#185FA5",
  "#931d9e",
  "#7c0c4b",
  "#1d9e75",
  "#d97706",
  "#dc2626",
];

type AreaNumericField =
  | "ops_win"
  | "ops_loss"
  | "ops_draw"
  | "ops"
  | "kpi_1"
  | "kpi_2"
  | "kpi_3";

function pieDataFor(
  area: KpiAreaComputed,
  subFields: AreaNumericField[],
): ChartData<"doughnut"> | null {
  const data = subFields.map((f) => area[f]);
  const sum = data.reduce((a, b) => a + b, 0);
  if (sum === 0) return null;
  return {
    labels: subFields.map((f) => f.replace(/_/g, " ").toUpperCase()),
    datasets: [
      {
        data,
        backgroundColor: subFields.map(
          (_, i) => PIE_COLORS[i % PIE_COLORS.length],
        ),
        borderWidth: 0,
      },
    ],
  };
}

function formatWithK(value: number): string {
  if (value >= 1000) {
    return (value / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return value.toString();
}

const cards = computed<KpiCardDef[]>(() => {
  const c: KpiCardDef[] = [];
  if (!props.areas.length) return c;
  for (const area of props.areas) {
    c.push({
      label: `Area ${area.area}`,
      value: formatWithK(area.ops),
      // subValue: `KPI 1: ${area.kpi_1}%`,
      pieData: pieDataFor(area, ["ops_win", "ops_loss", "ops_draw"]),
      monitor: {
        label: `KPI 1: Some parameter`,
        value: `${area.kpi_1}%`,
        delta: area.kpi_1,
        prev: `vs Week ${area.week - 1}`,
      },
    });
  }
  return c;
});

const meta = computed(() => `W${props.week} · ${props.year}`);

const pieItems = computed<PieItem[]>(() =>
  props.areas.map((a, i) => ({
    label: `Area ${a.area}`,
    value: a.ops,
    color: PIE_COLORS[i % PIE_COLORS.length],
  })),
);

const histItems = computed<HistogramItem[]>(() =>
  props.areas.map((a) => ({
    label: `Area ${a.area}`,
    value: a.kpi_1,
  })),
);


const tableData = ref<Record<string, unknown>[]>([]);
tableData.value = [
  {
    area: "Area 1",
    ops: 1234,
    kpi_1: 0.85,
    kpi_2: 0.78,
    kpi_3: 0.92
  },
  {
    area: "Area 2",
    ops: 5678,
    kpi_1: 0.65,
    kpi_2: 0.88,
    kpi_3: 0.72
  },
  {
    area: "Area 3",
    ops: 9101,
    kpi_1: 0.95,
    kpi_2: 0.68,
    kpi_3: 0.82
  },
]
const columns = computed<ColumnDef[]>(() => [
  { key: "area", label: "Area" },
  { key: "ops", label: "Ops", badge: "delta" },
  { key: "kpi_1", label: "KPI 1", badge: "progress" },
  { key: "kpi_2", label: "KPI 2", badge: "progress" },
  { key: "kpi_3", label: "KPI 3", badge: "progress" },
]);
</script>

<template>
  <SlideSection :columns="2" :rows="2">
    <BentoCard size="1x1" eyebrow="Ops per area">
      <WidgetPie :data="pieItems" kind="doughnut" :formatValue="formatWithK" />
    </BentoCard>
    <BentoCard size="1x1" eyebrow="Riepilogo KPI">
      <WidgetTable :columns="columns" :data="tableData" :maxRows="5"/>
    </BentoCard>
    <BentoCard size="1x1" eyebrow="Distribuzione geografica">
      <WidgetMap :data="props.geoData ? props.geoData : []" />
    </BentoCard>
    <BentoCard size="1x1" eyebrow="KPI 1 per area">
      <WidgetHistogram :data="histItems" :formatValue="(v) => v.toFixed(0) + '%'" />
    </BentoCard>
  </SlideSection>
</template>
