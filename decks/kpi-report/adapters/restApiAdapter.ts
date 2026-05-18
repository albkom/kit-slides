import type {
  IAdapter,
  AdapterOptions,
  AreaRow,
  ChannelRow,
  PerformanceRow,
  GeoRow,
  DeliveryRow,
} from "../types";

// TODO: implementare il mapping payload REST → shape normalizzata.
// Le firme rispettano il contratto IAdapter aggiornato; i body restituiscono
// passthrough opportunistici e dovranno essere rivisti quando l'endpoint sarà
// usato a runtime.
export class RestApiAdapter implements IAdapter {
  protected readonly base: string;

  constructor(options: AdapterOptions) {
    if (!options.baseUrl) throw new Error("RestApiAdapter requires baseUrl");
    this.base = options.baseUrl.replace(/\/$/, "");
  }

  async fecthAreas(): Promise<AreaRow[]> {
    return this._get<AreaRow[]>("/api/kpi/summary");
  }
  async fetchChannels(): Promise<ChannelRow[]> {
    return this._get<ChannelRow[]>("/api/kpi/channels");
  }
  async fetchPerformance(): Promise<PerformanceRow[]> {
    return this._get<PerformanceRow[]>("/api/kpi/performance");
  }
  async fetchGeo(): Promise<GeoRow[] | null> {
    try {
      return await this._get<GeoRow[]>("/api/kpi/geo");
    } catch {
      return null;
    }
  }
  async fetchDelivery(): Promise<DeliveryRow[] | null> {
    try {
      return await this._get<DeliveryRow[]>("/api/kpi/delivery");
    } catch {
      return null;
    }
  }

  protected async _get<T>(path: string): Promise<T> {
    const res = await fetch(this.base + path);
    if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
    return res.json() as Promise<T>;
  }
}
