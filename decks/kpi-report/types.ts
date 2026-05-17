import type { KpiStato } from "../../src/types";

// ── Raw PapaParse rows (everything is a string from CSV) ─────────────────────
export interface RawSummaryRow {
  week: string;
  area: string;
  ops: number;
  kpi_1: number;
  kpi_2: number;
  kpi_3: number;
  ops_win: number;
  ops_loss: number;
  ops_draw: number;
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

export interface RawCategoryRow {
  week: string;
  year: string;
  categoria: string;
  fatturato: string;
  fatturato_prev: string;
  ordini: string;
  ordini_prev: string;
  target_fatturato: string;
  stato: string;
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
  wip: number;
  env_a: number;
  env_b: number;
  env_c: number;
  env_d: number;
}

// ── Adapter contract ─────────────────────────────────────────────────────────
export interface IAdapter {
  fecthAreas(): Promise<RawSummaryRow[]>;
  fetchChannels(): Promise<RawChannelRow[]>;
  fetchCategories(): Promise<RawCategoryRow[]>;
  fetchGeo(): Promise<RawGeoRow[] | null>;
  fetchDelivery(): Promise<RawDeliveryRow[]>;
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

export interface KpiCategory {
  categoria: string;
  fatturato: number;
  fatturato_delta: number | null;
  ordini: number;
  target_fatturato: number;
  stato: KpiStato;
}
