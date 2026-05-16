export class RestApiAdapter {
  constructor({ baseUrl }) {
    if (!baseUrl) throw new Error('RestApiAdapter requires baseUrl')
    this.base = baseUrl.replace(/\/$/, '')
  }

  async fetchSummary()    { return this._get('/api/kpi/summary') }
  async fetchChannels()   { return this._get('/api/kpi/channels') }
  async fetchCategories() { return this._get('/api/kpi/categories') }

  async fetchGeo() {
    try {
      return await this._get('/api/kpi/geo')
    } catch {
      return null
    }
  }

  async _get(path) {
    const res = await fetch(this.base + path)
    if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
    return res.json()
  }
}
