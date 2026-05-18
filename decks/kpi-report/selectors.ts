import type {
  KpiPerformance,
  PerformanceComputed,
  KpiAreaComputed,
  GeoDataPoint,
  DeliveryComputed,
} from "../../index";

// ── Pure selectors over computed deck data ───────────────────────────────────
// These functions are the deck's vocabulary for filtering and reordering data
// before it reaches the slides. Keep them small and composable.

function sortedDesc<T>(rows: readonly T[], key: (row: T) => number): T[] {
  return [...rows].sort((a, b) => key(b) - key(a));
}

export function topByUsage(
  rows: readonly PerformanceComputed[],
  n: number,
): PerformanceComputed[] {
  return sortedDesc(rows, (r) => r.usage).slice(0, n);
}

export function topByKpi(
  rows: readonly PerformanceComputed[],
  n: number,
  key: "kpi_1" | "kpi_2" | "kpi_3" = "kpi_1",
): PerformanceComputed[] {
  return sortedDesc(rows, (r) => r[key]).slice(0, n);
}

export function topByOks(
  rows: readonly KpiPerformance[],
  n: number,
): KpiPerformance[] {
  return sortedDesc(rows, (r) => r.oks).slice(0, n);
}

export function topGeo(rows: readonly GeoDataPoint[], n: number): GeoDataPoint[] {
  return sortedDesc(rows, (r) => r.value).slice(0, n);
}

export function deliveryByName(
  rows: readonly DeliveryComputed[],
  n: number,
): DeliveryComputed[] {
  return [...rows]
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, n);
}

export function areasByName(
  rows: readonly KpiAreaComputed[],
): KpiAreaComputed[] {
  return [...rows].sort((a, b) => a.area.localeCompare(b.area));
}
