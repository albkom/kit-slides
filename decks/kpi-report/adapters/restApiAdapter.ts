import type {
  IAdapter,
  AdapterOptions,
  RawSummaryRow,
  RawChannelRow,
  RawCategoryRow,
  RawGeoRow,
} from '../types'

export class RestApiAdapter implements IAdapter {
  protected readonly base: string

  constructor(options: AdapterOptions) {
    if (!options.baseUrl) throw new Error('RestApiAdapter requires baseUrl')
    this.base = options.baseUrl.replace(/\/$/, '')
  }

  async fecthAreas(): Promise<RawSummaryRow[]> {
    return this._get<RawSummaryRow[]>('/api/kpi/summary')
  }
  async fetchChannels(): Promise<RawChannelRow[]> {
    return this._get<RawChannelRow[]>('/api/kpi/channels')
  }
  async fetchCategories(): Promise<RawCategoryRow[]> {
    return this._get<RawCategoryRow[]>('/api/kpi/categories')
  }

  async fetchGeo(): Promise<RawGeoRow[] | null> {
    try {
      return await this._get<RawGeoRow[]>('/api/kpi/geo')
    } catch {
      return null
    }
  }

  protected async _get<T>(path: string): Promise<T> {
    const res = await fetch(this.base + path)
    if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
    return res.json() as Promise<T>
  }
}
