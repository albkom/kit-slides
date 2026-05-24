import { computed } from "vue";
import type { PerformanceComputed, ColumnDef } from "../types";

const num = new Intl.NumberFormat("it-IT");

export const tableColumns: ColumnDef[] = [
  { key: "name", label: "Name", align: "left", width: "10%" },
  {
    key: "usage",
    label: "Usage",
    align: "left",
    width: "10%",
    format: (v) => num.format(Number(v)),
    badge: "progress",
  },
  {
    key: "tot",
    label: "Total",
    align: "left",
    width: "10%",
    format: (v) => num.format(Number(v)),
  },
  { key: "status", label: "Status", align: "left", width: "10%", badge: "status" },
  {
    key: "kpi_1",
    label: "KPI 1",
    align: "center",
    width: "10%",
    format: (v) => `${(Number(v) * 100).toFixed(1)}%`,
  },
  {
    key: "kpi_2",
    label: "KPI 2",
    align: "center",
    width: "10%",
    format: (v) => `${(Number(v) * 100).toFixed(1)}%`,
  },
  {
    key: "kpi_3",
    label: "KPI 3",
    align: "center",
    width: "10%",
    format: (v) => `${(Number(v) * 100).toFixed(1)}%`,
  },
  {
    key: "oks",
    label: "OKs",
    align: "center",
    width: "10%",
    format: (v) => num.format(Number(v)),
  },
  {
    key: "draws",
    label: "Draws",
    align: "center",
    width: "10%",
    format: (v) => num.format(Number(v)),
  },
  {
    key: "kos",
    label: "KOs",
    align: "center",
    width: "10%",
    format: (v) => num.format(Number(v)),
  },
];

export function useTableData(props: { performance: PerformanceComputed[] }) {
  const data = computed(
    () => props.performance as unknown as Record<string, unknown>[],
  );

  return { columns: tableColumns, data };
}
