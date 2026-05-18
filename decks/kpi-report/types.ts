// Re-export the kit's public adapter & computed types so deck code has a
// single import path for everything it consumes.
export * from "../../src/composables/types";

// ── CSV row shapes (internal to kpi-report) ──────────────────────────────────
// These are the raw string-typed rows produced by PapaParse before the CSV
// adapter normalizes them to the kit's stable AreaRow/ChannelRow/... shapes.
// They are intentionally NOT exported from the kit's public surface.

export interface RawSummaryRow {
  week: string;
  year: string;
  area: string;
  ops: string;
  kpi_1: string;
  kpi_2: string;
  kpi_3: string;
  ops_win: string;
  ops_loss: string;
  ops_draw: string;
}

export interface RawChannelRow {
  name: string;
  total: string;
  oks: string;
  draws: string;
  kos: string;
  kpi_1: string;
  kpi_2: string;
  kpi_3: string;
}

export interface RawPerformanceRow {
  week: string;
  name: string;
  tot: string;
  oks: string;
  kos: string;
  draws: string;
  kpi_1: string;
  kpi_2: string;
  kpi_3: string;
}

export interface RawGeoRow {
  week: string;
  year: string;
  code: string;
  value: string;
}

export interface RawDeliveryRow {
  week: string;
  name: string;
  wip: string;
  env_a: string;
  env_b: string;
  env_c: string;
  env_d: string;
}
