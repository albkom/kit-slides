import { ref, computed } from "vue";
import type { ComputedRef, Ref } from "vue";
import type { GeoDataPoint } from "../types";
import type {
  IAdapter,
  RawSummaryRow,
  RawChannelRow,
  RawPerformanceRow,
  RawGeoRow,
  KpiAreaComputed,
  KpiChannel,
  KpiPerformance,
  WeekRef,
  RawDeliveryRow,
  DeliveryComputed,
  PerformanceComputed,
  Status,
} from "./types";

function toNum(v: string | number | null | undefined): number {
  const n = parseFloat(String(v ?? "").replace(",", "."));
  return isNaN(n) ? 0 : n;
}

function delta(current: number, prev: number): number | null {
  if (!prev || prev === 0) return null;
  return ((current - prev) / Math.abs(prev)) * 100;
}

/** Validate that every row contains every required field (non-empty). */
function validateRows(
  source: string,
  rows: readonly Record<string, unknown>[],
  required: readonly string[],
): void {
  rows.forEach((row, idx) => {
    for (const field of required) {
      const v = row[field];
      if (v === undefined || v === null || String(v).trim() === "") {
        throw new Error(
          `${source}: campo "${field}" mancante o vuoto alla riga ${idx + 1}`,
        );
      }
    }
  });
}

export interface UseKpiDataResult {
  currentWeek: ComputedRef<WeekRef | null>;
  areas: ComputedRef<KpiAreaComputed[] | null>;
  delivery: ComputedRef<DeliveryComputed[] | null>;
  channels: ComputedRef<KpiChannel[]>;
  performance: ComputedRef<KpiPerformance[]>;
  geoData: ComputedRef<GeoDataPoint[]>;
  isLoading: Ref<boolean>;
  error: Ref<string | null>;
}

export function useKpiData(adapter: IAdapter): UseKpiDataResult {
  const isLoading = ref(true);
  const error = ref<string | null>(null);

  const _areas = ref<RawSummaryRow[]>([]);
  const _channels = ref<RawChannelRow[]>([]);
  const _performance = ref<RawPerformanceRow[]>([]);
  const _geo = ref<RawGeoRow[]>([]);
  const _delivery = ref<RawDeliveryRow[]>([]);

  const currentWeek = computed<WeekRef | null>(() => {
    if (!_areas.value.length) return null;
    const maxWeek = Math.max(..._areas.value.map((r) => Number(r.week)));
    const maxYear = Math.max(..._areas.value.map((r) => Number(r.year)));
    return { week: maxWeek, year: maxYear };
  });

  const areas = computed<KpiAreaComputed[] | null>(() => {
    if (!currentWeek.value || !_areas.value.length) return null;
    const cw = currentWeek.value;
    const row = _areas.value.filter((r) => Number(r.week) === cw.week);
    if (!row.length) return null;
    const rowPrev = _areas.value.filter((r) => Number(r.week) === cw.week - 1);
    return row.map((r) => {
      const ops = toNum(r.ops);
      const kpi_1 = toNum(r.kpi_1);
      const kpi_2 = toNum(r.kpi_2);
      const kpi_3 = toNum(r.kpi_3);
      const ops_prev = rowPrev.find((rp) => rp.area === r.area)?.ops ?? 0;
      const kpi_1_prev = rowPrev.find((rp) => rp.area === r.area)?.kpi_1 ?? 0;
      const kpi_2_prev = rowPrev.find((rp) => rp.area === r.area)?.kpi_2 ?? 0;
      const kpi_3_prev = rowPrev.find((rp) => rp.area === r.area)?.kpi_3 ?? 0;
      return {
        week: Number(r.week),
        area: r.area,
        ops,
        kpi_1,
        kpi_2,
        kpi_3,
        ops_win: r.ops_win,
        ops_loss: r.ops_loss,
        ops_draw: r.ops_draw,
        ops_delta: delta(ops, ops_prev),
        kpi_1_delta: delta(kpi_1, kpi_1_prev),
        kpi_2_delta: delta(kpi_2, kpi_2_prev),
        kpi_3_delta: delta(kpi_3, kpi_3_prev),
      };
    });
  });

  function computeDelivery(row: RawDeliveryRow): DeliveryComputed {
    const computed: DeliveryComputed = {
      week: Number(row.week),
      name: row.name,
      wip: toNum(row.wip),
      env_a: toNum(row.env_a),
      env_b: toNum(row.env_b),
      env_c: toNum(row.env_c),
      env_d: toNum(row.env_d),
      status: "-",
    };
    if (computed.wip > computed.env_a) {
      computed.status = "WIP";
    }
    const envMax = Math.max(computed.env_a, computed.env_b, computed.env_c);
    if (envMax > computed.env_d) {
      computed.status = "Delayed";
    }

    return computed;
  }

  const delivery = computed<DeliveryComputed[] | null>(() => {
    if (!currentWeek.value || !_delivery.value.length) return null;
    const cw = currentWeek.value;
    const row = _delivery.value.filter((r) => Number(r.week) === cw.week);
    if (!row.length) return null;

    return row.map((r) => computeDelivery(r));
  });

  const channels = computed<KpiChannel[]>(() => {
    if (!currentWeek.value) return [];
    return _channels.value
      .map((r) => ({
        name: r.name,
        total: toNum(r.total),
        oks: toNum(r.oks),
        kos: toNum(r.kos),
        draws: toNum(r.draws),
        kpi_1: toNum(r.kpi_1),
        kpi_2: toNum(r.kpi_2),
        kpi_3: toNum(r.kpi_3),
      }))
      .sort((a, b) => b.oks - a.oks);
  });

  function checkStatus(kpi: number): Status {
    if (kpi >= 0.9) return "GOOD";
    if (kpi >= 0.75) return "ACCEPTABLE";
    if (kpi >= 0.5) return "WARNING";
    return "BAD";
  }

  const performance = computed<PerformanceComputed[]>(() => {
    if (!currentWeek.value) return [];
    const maxTot = Math.max(..._performance.value.map((r) => toNum(r.tot)));
    return _performance.value
      .map((r) => ({
        week: Number(r.week),
        name: r.name,
        tot: toNum(r.tot),
        oks: toNum(r.oks),
        kos: toNum(r.kos),
        draws: toNum(r.draws),
        kpi_1: r.kos / r.tot,
        kpi_2: r.tot / maxTot,
        kpi_3: r.kos / r.tot,
        usage: r.tot / maxTot,
        status: checkStatus(r.kos / r.tot),
      }))
      .sort((a, b) => b.oks - a.oks);
  });

  const geoData = computed<GeoDataPoint[]>(() => {
    if (!currentWeek.value) return [];
    const cw = currentWeek.value;
    return _geo.value
      .filter((r) => Number(r.week) === cw.week && Number(r.year) === cw.year)
      .map((r) => ({
        code: r.code.trim().toUpperCase(),
        value: toNum(r.value),
      }));
  });

  async function load() {
    try {
      isLoading.value = true;
      error.value = null;
      const [s, ch, performance, geo, delivery] = await Promise.all([
        adapter.fecthAreas(),
        adapter.fetchChannels(),
        adapter.fetchPerformance(),
        adapter.fetchGeo(),
        adapter.fetchDelivery(),
      ]);

      validateRows("kpi_areas", s as unknown as Record<string, unknown>[], [
        "week",
        "area",
        "ops",
        "kpi_1",
        "kpi_2",
        "kpi_3",
        "ops_win",
        "ops_loss",
        "ops_draw",
      ]);
      validateRows(
        "performance",
        performance as unknown as Record<string, unknown>[],
        ["week", "name", "tot", "oks", "kos", "draws"],
      );
      if (geo) {
        validateRows("geo_kpi", geo as unknown as Record<string, unknown>[], [
          "week",
          "year",
          "code",
          "value",
        ]);
      }
      if (delivery) {
        validateRows(
          "delivery",
          delivery as unknown as Record<string, unknown>[],
          ["week", "name", "wip", "env_a", "env_b", "env_c", "env_d"],
        );
      }

      _areas.value = s;
      _channels.value = ch;
      _performance.value = performance;
      _geo.value = geo ?? [];
      _delivery.value = delivery ?? [];
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
    } finally {
      isLoading.value = false;
    }
  }

  load();

  return {
    currentWeek,
    areas,
    delivery,
    channels,
    performance,
    geoData,
    isLoading,
    error,
  };
}
