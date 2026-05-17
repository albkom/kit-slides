import type { Component } from "vue";
import type { ChartData, ChartOptions, Plugin } from "chart.js";

export type KpiStato = "in_target" | "attenzione" | "sotto_target";

export interface GeoDataPoint {
  code: string;
  value: number;
}

// ── Slide deck ───────────────────────────────────────────────────────────────
export interface SlideDefinition {
  component: Component;
  props: Record<string, unknown>;
  isCover?: boolean;
  /** Optional text note displayed at the bottom-left corner of the slide. */
  note?: string;
}

// ── Generic slide configuration (built-in slides) ────────────────────────────

export type ColumnAlign = "left" | "center" | "right";

export interface ColumnDef {
  key: string;
  label: string;
  align?: ColumnAlign;
  width?: string;
  format?: (value: unknown, row: Record<string, unknown>) => string;
  /**
   * Render the cell as a built-in badge:
   *  - 'delta'  → DeltaBadge (value must be number | null)
   *  - 'status' → StatusBadge (value must be a KpiStato string)
   *  - 'progress' → ProgressBadge (value must be a number | null)
   */
  badge?: "delta" | "status" | "progress";
}

export interface KpiMonitor {
  label: string;
  value: string | number;
  delta?: number | null;
  prev?: string | number;
}

export interface KpiCardDef {
  label: string;
  value: string | number;
  subValue?: string | number;
  monitor?: KpiMonitor;
  delta?: number | null;
  icon?: string;
  pieData?: unknown;
}

export interface TableSlideConfig {
  title?: string;
  meta?: string;
  columns: ColumnDef[];
  maxRows?: number;
}

export interface KpiSlideConfig {
  title?: string;
  meta?: string;
  cards: KpiCardDef[];
}

export type ChartKind = "bar" | "line" | "doughnut" | "pie";

export interface ChartSlideConfig<K extends ChartKind = ChartKind> {
  title?: string;
  meta?: string;
  kind?: K;
  data: ChartData<K>;
  options?: ChartOptions<K>;
  plugins?: Plugin<K>[];
}

export interface CoverSlideConfig {
  title: string;
  subtitle?: string;
  badge?: string;
  meta?: string;
}

export interface MapSlideConfig {
  title?: string;
  meta?: string;
  topCount?: number;
  /** Map alpha-2 country code → display name (for the Top-N list & tooltip). */
  countryNames?: Record<string, string>;
  /** Format the value for the tooltip and Top-N list. */
  formatValue?: (value: number) => string;
  /** Compact format used in the Top-N list (e.g. €1.2M). */
  formatCompact?: (value: number) => string;
}
