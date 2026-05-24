import { computed } from "vue";
import type { KpiAreaComputed, KpiChannel, ColumnDef } from "../types";
import type { GeoDataPoint, PieItem, HistogramItem } from "kit-slides";

export interface ShowcaseProps {
  geoData?: GeoDataPoint[];
  areas: KpiAreaComputed[];
  channels?: KpiChannel[];
  week: number;
  year: number;
}

const PIE_COLORS = [
  "#185FA5",
  "#931d9e",
  "#7c0c4b",
  "#1d9e75",
  "#d97706",
  "#dc2626",
];

export function formatWithK(value: number): string {
  if (value >= 1000) {
    return (value / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return value.toString();
}

export function useShowcaseData(props: ShowcaseProps) {
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

  const tableData = computed<Record<string, unknown>[]>(() =>
    props.areas.map((a) => ({
      area: `Area ${a.area}`,
      ops: a.ops,
      kpi_1: a.kpi_1,
      kpi_2: a.kpi_2,
      kpi_3: a.kpi_3,
    })),
  );

  const columns: ColumnDef[] = [
    { key: "area", label: "Area" },
    { key: "ops", label: "Ops", badge: "delta" },
    { key: "kpi_1", label: "KPI 1", badge: "progress" },
    { key: "kpi_2", label: "KPI 2", badge: "progress" },
    { key: "kpi_3", label: "KPI 3", badge: "progress" },
  ];

  return { pieItems, histItems, tableData, columns };
}
