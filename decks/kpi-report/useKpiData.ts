import { ref, computed } from "vue";
import type { ComputedRef, Ref } from "vue";
import type { GeoDataPoint, Status } from "../../index";
import type {
  IKpiAdapter,
  AreaRow,
  ChannelRow,
  PerformanceRow,
  GeoRow,
  DeliveryRow,
  KpiAreaComputed,
  KpiChannel,
  WeekRef,
  DeliveryComputed,
  PerformanceComputed,
} from "./types";

function delta(current: number, prev: number): number | null {
  if (!prev || prev === 0) return null;
  return ((current - prev) / Math.abs(prev)) * 100;
}

function validateRows<T extends object>(
  source: string,
  rows: readonly T[],
  required: readonly (keyof T)[],
): void {
  rows.forEach((row, idx) => {
    for (const field of required) {
      const v = row[field];
      if (v === undefined || v === null || String(v).trim() === "") {
        throw new Error(
          `${source}: campo "${String(field)}" mancante o vuoto alla riga ${idx + 1}`,
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
  performance: ComputedRef<PerformanceComputed[]>;
  geoData: ComputedRef<GeoDataPoint[]>;
  isLoading: Ref<boolean>;
  error: Ref<string | null>;
}

export function useKpiData(adapter: IKpiAdapter): UseKpiDataResult {
  const isLoading = ref(true);
  const error = ref<string | null>(null);

  const _areas = ref<AreaRow[]>([]);
  const _channels = ref<ChannelRow[]>([]);
  const _performance = ref<PerformanceRow[]>([]);
  const _geo = ref<GeoRow[]>([]);
  const _delivery = ref<DeliveryRow[]>([]);

  const currentWeek = computed<WeekRef | null>(() => {
    if (!_areas.value.length) return null;
    const maxWeek = Math.max(..._areas.value.map((r) => r.week));
    const maxYear = Math.max(..._areas.value.map((r) => r.year));
    return { week: maxWeek, year: maxYear };
  });

  const areas = computed<KpiAreaComputed[] | null>(() => {
    if (!currentWeek.value || !_areas.value.length) return null;
    const cw = currentWeek.value;
    const row = _areas.value.filter((r) => r.week === cw.week);
    if (!row.length) return null;
    const rowPrev = _areas.value.filter((r) => r.week === cw.week - 1);
    return row.map((r) => {
      const prev = rowPrev.find((rp) => rp.area === r.area);
      return {
        week: r.week,
        area: r.area,
        ops: r.ops,
        kpi_1: r.kpi_1,
        kpi_2: r.kpi_2,
        kpi_3: r.kpi_3,
        ops_win: r.ops_win,
        ops_loss: r.ops_loss,
        ops_draw: r.ops_draw,
        ops_delta: delta(r.ops, prev?.ops ?? 0),
        kpi_1_delta: delta(r.kpi_1, prev?.kpi_1 ?? 0),
        kpi_2_delta: delta(r.kpi_2, prev?.kpi_2 ?? 0),
        kpi_3_delta: delta(r.kpi_3, prev?.kpi_3 ?? 0),
      };
    });
  });

  function computeDelivery(row: DeliveryRow): DeliveryComputed {
    const out: DeliveryComputed = {
      week: row.week,
      name: row.name,
      wip: row.wip,
      env_a: row.env_a,
      env_b: row.env_b,
      env_c: row.env_c,
      env_d: row.env_d,
      status: "-",
    };
    if (out.wip > out.env_a) {
      out.status = "WIP";
    }
    const envMax = Math.max(out.env_a, out.env_b, out.env_c);
    if (envMax > out.env_d) {
      out.status = "Delayed";
    }
    return out;
  }

  const delivery = computed<DeliveryComputed[] | null>(() => {
    if (!currentWeek.value || !_delivery.value.length) return null;
    const cw = currentWeek.value;
    const row = _delivery.value.filter((r) => r.week === cw.week);
    if (!row.length) return null;
    return row.map((r) => computeDelivery(r));
  });

  const channels = computed<KpiChannel[]>(() => {
    if (!currentWeek.value) return [];
    return [..._channels.value].sort((a, b) => b.oks - a.oks);
  });

  function checkStatus(kpi: number): Status {
    if (kpi >= 0.9) return "GOOD";
    if (kpi >= 0.75) return "ACCEPTABLE";
    if (kpi >= 0.5) return "WARNING";
    return "BAD";
  }

  const performance = computed<PerformanceComputed[]>(() => {
    if (!currentWeek.value) return [];
    const maxTot = Math.max(..._performance.value.map((r) => r.tot));
    return _performance.value
      .map((r) => ({
        week: r.week,
        name: r.name,
        tot: r.tot,
        oks: r.oks,
        kos: r.kos,
        draws: r.draws,
        kpi_1: r.tot === 0 ? 0 : r.kos / r.tot,
        kpi_2: maxTot === 0 ? 0 : r.tot / maxTot,
        kpi_3: r.tot === 0 ? 0 : r.kos / r.tot,
        usage: maxTot === 0 ? 0 : r.tot / maxTot,
        status: checkStatus(r.tot === 0 ? 0 : r.kos / r.tot),
      }))
      .sort((a, b) => b.oks - a.oks);
  });

  const geoData = computed<GeoDataPoint[]>(() => {
    if (!currentWeek.value) return [];
    const cw = currentWeek.value;
    return _geo.value
      .filter((r) => r.week === cw.week && r.year === cw.year)
      .map((r) => ({ code: r.code, value: r.value }));
  });

  async function load() {
    try {
      isLoading.value = true;
      error.value = null;
      const [s, ch, perf, geo, deliv] = await Promise.all([
        adapter.fetchAreas(),
        adapter.fetchChannels(),
        adapter.fetchPerformance(),
        adapter.fetchGeo(),
        adapter.fetchDelivery(),
      ]);

      validateRows<AreaRow>("kpi_areas", s, [
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
      validateRows<PerformanceRow>("performance", perf, [
        "week",
        "name",
        "tot",
        "oks",
        "kos",
        "draws",
      ]);
      if (geo) {
        validateRows<GeoRow>("geo", geo, ["week", "year", "code", "value"]);
      }
      if (deliv) {
        validateRows<DeliveryRow>("delivery", deliv, [
          "week",
          "name",
          "wip",
          "env_a",
          "env_b",
          "env_c",
          "env_d",
        ]);
      }

      _areas.value = s;
      _channels.value = ch;
      _performance.value = perf;
      _geo.value = geo ?? [];
      _delivery.value = deliv ?? [];
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
