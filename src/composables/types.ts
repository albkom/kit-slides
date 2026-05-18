import type { Status } from "../types";

// ── Adapter contract — normalized data shapes ────────────────────────────────
// Field names are the kit's stable contract, independent of any specific data
// source (CSV column names, REST payload keys, etc.). Adapters are responsible
// for mapping their source to these shapes.

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

export interface IAdapter {
  fecthAreas(): Promise<AreaRow[]>;
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

export type { Status };
