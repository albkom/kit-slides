import { ref, computed } from "vue";
import type { GeoDataPoint, Status } from "kit-slides";
import type {
  AreaRow,
  ChannelRow,
  PerformanceRow,
  GeoRow,
  KpiAreaComputed,
  KpiChannel,
  WeekRef,
  PerformanceComputed,
  ResultsDistributionRow,
} from "../types";

function delta(current: number, prev: number): number | null {
  if (!prev || prev === 0) return null;
  return ((current - prev) / Math.abs(prev)) * 100;
}

function checkStatus(kpi: number): Status {
  if (kpi >= 0.9) return "GOOD";
  if (kpi >= 0.75) return "ACCEPTABLE";
  if (kpi >= 0.5) return "WARNING";
  return "BAD";
}

const _areas = ref<AreaRow[]>([]);
const _channels = ref<ChannelRow[]>([]);
const _performance = ref<PerformanceRow[]>([]);
const _geo = ref<GeoRow[]>([]);
const _resultsDistribution = ref<ResultsDistributionRow[]>([]);

export const currentWeek = computed<WeekRef | null>(() => {
  if (!_areas.value.length) return null;
  const maxWeek = Math.max(..._areas.value.map((r) => r.week));
  const maxYear = Math.max(..._areas.value.map((r) => r.year));
  return { week: maxWeek, year: maxYear };
});

export const areas = computed<KpiAreaComputed[] | null>(() => {
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

export const channels = computed<KpiChannel[]>(() => {
  if (!currentWeek.value) return [];
  return [..._channels.value].sort((a, b) => b.oks - a.oks);
});

export const performance = computed<PerformanceComputed[]>(() => {
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
      kpi_1: r.tot === 0 ? 0 : r.oks / r.tot,
      kpi_2: maxTot === 0 ? 0 : r.tot / maxTot,
      kpi_3: r.tot === 0 ? 0 : r.kos / r.tot,
      usage: maxTot === 0 ? 0 : r.tot / maxTot,
      status: checkStatus(r.tot === 0 ? 0 : r.kos / r.tot),
    }))
    .sort((a, b) => b.oks - a.oks);
});

export const resultsDistribution = computed<ResultsDistributionRow[]>(() => {
  if (!currentWeek.value) return [];
  return _resultsDistribution.value;
});

export const geoData = computed<GeoDataPoint[]>(() => {
  if (!currentWeek.value) return [];
  const cw = currentWeek.value;
  return _geo.value
    .filter((r) => r.week === cw.week && r.year === cw.year)
    .map((r) => ({ code: r.code, value: r.value }));
});

export function setData(data: {
  areas: AreaRow[];
  channels: ChannelRow[];
  performance: PerformanceRow[];
  geo: GeoRow[];
  resultsDistribution: ResultsDistributionRow[];
}) {
  _areas.value = data.areas;
  _channels.value = data.channels;
  _performance.value = data.performance;
  _geo.value = data.geo;
  _resultsDistribution.value = data.resultsDistribution ?? [];
}
