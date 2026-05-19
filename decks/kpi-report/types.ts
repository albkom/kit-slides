// Re-export the kit's public surface so deck code has a single import path
// for everything it consumes from kit-slides.
export * from "../../index";

import type { IAdapter, Status } from "../../index";

// ── Adapter contract — normalized data shapes ────────────────────────────────
// Field names are this deck's stable contract, independent of any specific
// data source (CSV column names, REST payload keys, etc.). Adapters are
// responsible for mapping their source to these shapes.

export interface AreaRow {
  week: number;
  year: number;
  area: string;
  ops: number;
  kpi_1: number;
  kpi_2: number;
  kpi_3: number;
  ops_win: number;
  ops_loss: number;
  ops_draw: number;
}

export interface ChannelRow {
  name: string;
  total: number;
  oks: number;
  draws: number;
  kos: number;
  kpi_1: number;
  kpi_2: number;
  kpi_3: number;
}

export interface PerformanceRow {
  week: number;
  name: string;
  tot: number;
  oks: number;
  kos: number;
  draws: number;
  kpi_1: number;
  kpi_2: number;
  kpi_3: number;
}

export interface GeoRow {
  week: number;
  year: number;
  code: string;
  value: number;
}

export interface DeliveryRow {
  week: number;
  name: string;
  wip: number;
  env_a: number;
  env_b: number;
  env_c: number;
  env_d: number;
}

export interface IKpiAdapter extends IAdapter {
  fetchAreas(): Promise<AreaRow[]>;
  fetchChannels(): Promise<ChannelRow[]>;
  fetchPerformance(): Promise<PerformanceRow[]>;
  fetchGeo(): Promise<GeoRow[] | null>;
  fetchDelivery(): Promise<DeliveryRow[] | null>;
}

export interface AdapterOptions {
  basePath?: string;
  baseUrl?: string;
  port?: number;
}

export interface WeekRef {
  week: number;
  year: number;
}

// ── Computed shapes — produced by useKpiData from normalized adapter rows ────

export interface KpiAreaComputed {
  week: number;
  area: string;
  ops: number;
  kpi_1: number;
  kpi_2: number;
  kpi_3: number;
  ops_win: number;
  ops_loss: number;
  ops_draw: number;
  ops_delta: number | null;
  kpi_1_delta: number | null;
  kpi_2_delta: number | null;
  kpi_3_delta: number | null;
}

export interface DeliveryComputed {
  week: number;
  name: string;
  wip: number;
  env_a: number;
  env_b: number;
  env_c: number;
  env_d: number;
  status: string;
}

export interface PerformanceComputed {
  week: number;
  name: string;
  tot: number;
  oks: number;
  kos: number;
  draws: number;
  kpi_1: number;
  kpi_2: number;
  kpi_3: number;
  usage: number;
  status: Status;
}

export interface KpiChannel {
  name: string;
  total: number;
  oks: number;
  kos: number;
  draws: number;
  kpi_1: number;
  kpi_2: number;
  kpi_3: number;
}

export interface KpiPerformance {
  week: number;
  name: string;
  tot: number;
  oks: number;
  kos: number;
  draws: number;
  kpi_1: number;
  kpi_2: number;
  kpi_3: number;
}

// ── CSV row shapes (internal to kpi-report) ──────────────────────────────────
// Raw string-typed rows produced by PapaParse before the CSV adapter
// normalizes them to the AreaRow/ChannelRow/... shapes above.

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
