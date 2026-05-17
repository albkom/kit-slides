import type { Component } from 'vue'
import type { ChartData, ChartOptions, Plugin } from 'chart.js'

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

// ── Generic slide configuration (built-in slides) ────────────────────────────

export type ColumnAlign = 'left' | 'center' | 'right'

export interface ColumnDef {
  key: string
  label: string
  align?: ColumnAlign
  width?: string
  format?: (value: unknown, row: Record<string, unknown>) => string
  /**
   * Render the cell as a built-in badge:
   *  - 'delta'  → DeltaBadge (value must be number | null)
   *  - 'status' → StatusBadge (value must be a KpiStato string)
   */
  badge?: 'delta' | 'status'
}

export interface KpiCardDef {
  label: string
  value: string | number
  delta?: number | null
  icon?: string
  pieData?: unknown
}

export interface TableSlideConfig {
  title?: string
  meta?: string
  columns: ColumnDef[]
  maxRows?: number
}

export interface KpiSlideConfig {
  title?: string
  meta?: string
  cards: KpiCardDef[]
}

export type ChartKind = 'bar' | 'line' | 'doughnut' | 'pie'

export interface ChartSlideConfig<K extends ChartKind = ChartKind> {
  title?: string
  meta?: string
  kind?: K
  data: ChartData<K>
  options?: ChartOptions<K>
  plugins?: Plugin<K>[]
}

export interface CoverSlideConfig {
  title: string
  subtitle?: string
  badge?: string
  meta?: string
}

export interface MapSlideConfig {
  title?: string
  meta?: string
  topCount?: number
  /** Map alpha-2 country code → display name (for the Top-N list & tooltip). */
  countryNames?: Record<string, string>
  /** Format the value for the tooltip and Top-N list. */
  formatValue?: (value: number) => string
  /** Compact format used in the Top-N list (e.g. €1.2M). */
  formatCompact?: (value: number) => string
}
