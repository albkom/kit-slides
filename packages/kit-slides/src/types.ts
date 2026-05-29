export type Status = "GOOD" | "ACCEPTABLE" | "WARNING" | "BAD";

export interface IAdapter {
  // Base interface for all data adapters
}

export interface GeoDataPoint {
  code: string;
  value: number;
}

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
   *  - 'status' → StatusBadge (value must be a Status string)
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
