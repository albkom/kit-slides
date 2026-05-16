import Papa from 'papaparse'

export class CsvAdapter {
  constructor({ basePath = './data' } = {}) {
    this.basePath = basePath.replace(/\/$/, '')
  }

  async fetchSummary()    { return this._load('kpi_summary.csv') }
  async fetchChannels()   { return this._load('kpi_by_channel.csv') }
  async fetchCategories() { return this._load('kpi_by_category.csv') }
  async fetchGeo()        { return this._loadOptional('geo_kpi.csv') }

  async _load(file) {
    const res = await fetch(`${this.basePath}/${file}`)
    if (!res.ok) throw new Error(`Impossibile caricare ${file}: ${res.status}`)
    const text = await res.text()
    return this._parse(text)
  }

  async _loadOptional(file) {
    try {
      const res = await fetch(`${this.basePath}/${file}`)
      if (!res.ok) return null
      const text = await res.text()
      return this._parse(text)
    } catch {
      return null
    }
  }

  _parse(text) {
    return Papa.parse(text.trim(), {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      transform: (v) => v.trim(),
    }).data
  }
}
