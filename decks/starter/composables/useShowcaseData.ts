import { computed } from "vue";
import type { ColumnDef } from "../types";
import type { PieItem, HistogramItem, RadarItem } from "kit-slides";
import {
  areas,
  geoData,
  channels,
  resultsDistribution,
} from "./useDashboardStore";
import { areasByName } from "../selectors";

export { geoData };

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

function getResultDescription(code: string): string {
  switch (code) {
    case "200":
      return "OK";
    case "400":
      return "Bad Request";
    case "401":
      return "Unauthorized";
    case "403":
      return "Forbidden";
    case "404":
      return "Not Found";
    case "429":
      return "Too Many Requests";
    case "500":
      return "Internal Server Error";
    case "502":
      return "Bad Gateway";
    case "503":
      return "Service Unavailable";
    case "504":
      return "Gateway Timeout";
    default:
      return `Code ${code}`;
  }
}

export function useShowcaseData() {
  const sortedAreas = computed(() => areasByName(areas.value ?? []));

  const grouped = new Map<string, number>();
  resultsDistribution.value?.forEach((item) => {
    const current = grouped.get(item.code) ?? 0;
    grouped.set(item.code, current + item.ops);
  });
  const groupedArray = Array.from(grouped.entries())
    .map(([code, ops]) => ({ code, ops }))
    .sort((a, b) => b.ops - a.ops)
    .slice(0, 4)
    .concat(
      Array.from(grouped.entries())
        .map(([code, ops]) => ({ code, ops }))
        .sort((a, b) => b.ops - a.ops)
        .slice(4)
        .reduce((acc, item) => acc + item.ops, 0) > 0
        ? [
            {
              code: "Other",
              ops: Array.from(grouped.entries())
                .map(([_, ops]) => ops)
                .sort((a, b) => b - a)
                .slice(4)
                .reduce((acc, ops) => acc + ops, 0),
            },
          ]
        : [],
    );

  const pieItems = computed<PieItem[]>(() =>
    groupedArray.map((a, i) => ({
      label: `${a.code} | ${getResultDescription(a.code)}`,
      value: a.ops,
      color: PIE_COLORS[i % PIE_COLORS.length],
    })),
  );

  const histItems = computed<HistogramItem[]>(() =>
    groupedArray.map((a) => ({
      label: `${a.code}`,
      value: a.ops,
    })),
  );

  const tableData = computed<Record<string, unknown>[]>(() =>
    groupedArray.map((a) => ({
      code: a.code,
      description: getResultDescription(a.code),
      ops: a.ops,
    })),
  );

  // Spokes = areas, one polygon per KPI so each KPI is visually distinct
  const radarAxes = computed<string[]>(() =>
    sortedAreas.value.map((a) => `Area ${a.area}`),
  );

  const radarItems = computed<RadarItem[]>(() => [
    {
      label: "KPI 1",
      values: sortedAreas.value.map((a) => +(a.kpi_1 * 100).toFixed(1)),
    },
    {
      label: "KPI 2",
      values: sortedAreas.value.map((a) => +(a.kpi_2 * 100).toFixed(1)),
    },
    {
      label: "KPI 3",
      values: sortedAreas.value.map((a) => +(a.kpi_3 * 100).toFixed(1)),
    },
  ]);

  const columns: ColumnDef[] = [
    { key: "code", label: "Code" },
    { key: "description", label: "Description" },
    { key: "ops", label: "Ops" },
    {
      key: "percentage",
      label: "Percentage",
      format: (value, row) => {
        const total = resultsDistribution.value.reduce(
          (sum, item) => sum + item.ops,
          0,
        );
        const percentage = total > 0 ? ((row.ops as number) / total) * 100 : 0;
        return percentage.toFixed(1) + "%";
      },
    },
  ];

  return {
    pieItems,
    histItems,
    tableData,
    columns,
    geoData,
    channels,
    resultsDistribution,
    radarItems,
    radarAxes,
  };
}
