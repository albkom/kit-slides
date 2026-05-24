import Papa from "papaparse";
import type {
  IKpiAdapter,
  AdapterOptions,
  AreaRow,
  ChannelRow,
  PerformanceRow,
  GeoRow,
  DeliveryRow,
  RawSummaryRow,
  RawChannelRow,
  RawPerformanceRow,
  RawGeoRow,
  RawDeliveryRow,
} from "../types";

function toNum(v: string | number | null | undefined): number {
  const n = parseFloat(String(v ?? "").replace(",", "."));
  return isNaN(n) ? 0 : n;
}

export class CsvAdapter implements IKpiAdapter {
  private readonly basePath: string;

  constructor(options: AdapterOptions = {}) {
    const base = options.basePath ?? "./data";
    this.basePath = base.replace(/\/$/, "");
  }

  async fetchAreas(): Promise<AreaRow[]> {
    const rows = await this._load<RawSummaryRow>("kpi_areas.csv");
    return rows.map((r) => ({
      week: toNum(r.week),
      year: toNum(r.year),
      area: r.area,
      ops: toNum(r.ops),
      kpi_1: toNum(r.kpi_1),
      kpi_2: toNum(r.kpi_2),
      kpi_3: toNum(r.kpi_3),
      ops_win: toNum(r.ops_win),
      ops_loss: toNum(r.ops_loss),
      ops_draw: toNum(r.ops_draw),
    }));
  }

  async fetchChannels(): Promise<ChannelRow[]> {
    const rows = await this._load<RawChannelRow>("kpi_by_channel.csv");
    return rows.map((r) => ({
      name: r.name,
      total: toNum(r.total),
      oks: toNum(r.oks),
      draws: toNum(r.draws),
      kos: toNum(r.kos),
      kpi_1: toNum(r.kpi_1),
      kpi_2: toNum(r.kpi_2),
      kpi_3: toNum(r.kpi_3),
    }));
  }

  async fetchPerformance(): Promise<PerformanceRow[]> {
    const rows = await this._load<RawPerformanceRow>("performance.csv");
    return rows.map((r) => ({
      week: toNum(r.week),
      name: r.name,
      tot: toNum(r.tot),
      oks: toNum(r.oks),
      kos: toNum(r.kos),
      draws: toNum(r.draws),
      kpi_1: toNum(r.kpi_1),
      kpi_2: toNum(r.kpi_2),
      kpi_3: toNum(r.kpi_3),
    }));
  }

  async fetchGeo(): Promise<GeoRow[] | null> {
    const rows = await this._loadOptional<RawGeoRow>("geo_kpi.csv");
    if (!rows) return null;
    return rows.map((r) => ({
      week: toNum(r.week),
      year: toNum(r.year),
      code: r.code.trim().toUpperCase(),
      value: toNum(r.value),
    }));
  }

  async fetchDelivery(): Promise<DeliveryRow[] | null> {
    const rows = await this._loadOptional<RawDeliveryRow>("delivery.csv");
    if (!rows) return null;
    return rows.map((r) => ({
      week: toNum(r.week),
      name: r.name,
      wip: toNum(r.wip),
      env_a: toNum(r.env_a),
      env_b: toNum(r.env_b),
      env_c: toNum(r.env_c),
      env_d: toNum(r.env_d),
    }));
  }

  private async _load<T>(file: string): Promise<T[]> {
    const res = await fetch(`${this.basePath}/${file}`);
    if (!res.ok) throw new Error(`Impossibile caricare ${file}: ${res.status}`);
    const text = await res.text();
    return this._parse<T>(text);
  }

  private async _loadOptional<T>(file: string): Promise<T[] | null> {
    try {
      const res = await fetch(`${this.basePath}/${file}`);
      if (!res.ok) return null;
      const text = await res.text();
      return this._parse<T>(text);
    } catch {
      return null;
    }
  }

  private _parse<T>(text: string): T[] {
    return Papa.parse<T>(text.trim(), {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim(),
      transform: (v: string) => v.trim(),
    }).data;
  }
}
