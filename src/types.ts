import type { Component } from 'vue'

// ── Raw PapaParse rows (everything is a string from CSV) ─────────────────────
export interface RawSummaryRow {
  week: string
  year: string
  fatturato: string
  fatturato_prev: string
  ordini: string
  ordini_prev: string
  tasso_conversione: string
  tasso_conversione_prev: string
  ticket_medio: string
  ticket_medio_prev: string
}

export interface RawChannelRow {
  name: string
  total: string
  oks: string
  draws: string
  kos: string
  kpi_1: string
  kpi_2: string
  kpi_3: string
}

export interface RawCategoryRow {
  week: string
  year: string
  categoria: string
  fatturato: string
  fatturato_prev: string
  ordini: string
  ordini_prev: string
  target_fatturato: string
  stato: string
}

export interface RawGeoRow {
  week: string
  year: string
  code: string
  value: string
}

// ── Transformed (useKpiData output) ──────────────────────────────────────────
export interface WeekRef {
  week: number
  year: number
}

export interface KpiSummary {
  fatturato: number
  fatturato_delta: number | null
  ordini: number
  ordini_delta: number | null
  tasso_conversione: number
  tasso_conversione_delta: number | null
  ticket_medio: number
  ticket_medio_delta: number | null
}

export interface KpiChannel {
  name: string
  total: number
  oks: number
  kos: number
  draws: number
  kpi_1: number
  kpi_2: number
  kpi_3: number
}

export type KpiStato = 'in_target' | 'attenzione' | 'sotto_target'

export interface KpiCategory {
  categoria: string
  fatturato: number
  fatturato_delta: number | null
  ordini: number
  target_fatturato: number
  stato: KpiStato
}

export interface GeoDataPoint {
  code: string
  value: number
}

// ── Adapter contract ─────────────────────────────────────────────────────────
export interface IAdapter {
  fetchSummary(): Promise<RawSummaryRow[]>
  fetchChannels(): Promise<RawChannelRow[]>
  fetchCategories(): Promise<RawCategoryRow[]>
  fetchGeo(): Promise<RawGeoRow[] | null>
}

export interface AdapterOptions {
  basePath?: string
  baseUrl?: string
  port?: number
}

// ── Slide deck ───────────────────────────────────────────────────────────────
export interface SlideDefinition {
  component: Component
  props: Record<string, unknown>
}
