import Papa from "papaparse";
import type {
  IAdapter,
  AdapterOptions,
  RawSummaryRow,
  RawChannelRow,
  RawCategoryRow,
  RawGeoRow,
  RawDeliveryRow,
} from "../types";

export class CsvAdapter implements IAdapter {
  private readonly basePath: string;

  constructor(options: AdapterOptions = {}) {
    const base = options.basePath ?? "./data";
    this.basePath = base.replace(/\/$/, "");
  }

  async fecthAreas(): Promise<RawSummaryRow[]> {
    return this._load<RawSummaryRow>("kpi_areas.csv");
  }
  async fetchChannels(): Promise<RawChannelRow[]> {
    return this._load<RawChannelRow>("kpi_by_channel.csv");
  }
  async fetchCategories(): Promise<RawCategoryRow[]> {
    return this._load<RawCategoryRow>("kpi_by_category.csv");
  }
  async fetchGeo(): Promise<RawGeoRow[] | null> {
    return this._loadOptional<RawGeoRow>("geo_kpi.csv");
  }
  async fetchDelivery(): Promise<RawDeliveryRow[]> {
    return this._load<RawDeliveryRow>("delivery.csv");
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
