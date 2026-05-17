<script setup lang="ts">
import { computed } from "vue";
import { KpiCardDef, KpiSlide } from "../../../index";
import type { ChartData } from "chart.js";
import { KpiChannel, KpiAreaComputed } from "../types";

interface Props {
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

type NumericChannelField =
  | "total"
  | "oks"
  | "kos"
  | "draws"
  | "kpi_1"
  | "kpi_2"
  | "kpi_3"
  | "ops_win"
  | "ops_loss"
  | "ops_draw";

function pieDataFor(
  area: KpiAreaComputed,
  tot: number,
  subFields: NumericChannelField[],
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

const eur = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const num = new Intl.NumberFormat("it-IT");
const pct = new Intl.NumberFormat("it-IT", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

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
      pieData: pieDataFor(area, area.ops, ["ops_win", "ops_loss", "ops_draw"]),
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
</script>

<template>
  <KpiSlide title="KPI Principali" :meta="meta" :cards="cards" />
</template>
