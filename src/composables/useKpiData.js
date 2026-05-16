import { ref, computed } from 'vue'
import Papa from 'papaparse'

function parseCsv(text) {
  const result = Papa.parse(text.trim(), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
    transform: (v) => v.trim(),
  })
  return result.data
}

function toNum(v) {
  const n = parseFloat(String(v).replace(',', '.'))
  return isNaN(n) ? 0 : n
}

function delta(current, prev) {
  if (!prev || prev === 0) return null
  return ((current - prev) / Math.abs(prev)) * 100
}

async function fetchCsv(path) {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Impossibile caricare ${path}: ${res.status}`)
  return res.text()
}

async function fetchCsvOptional(path) {
  try {
    const res = await fetch(path)
    return res.ok ? res.text() : null
  } catch {
    return null
  }
}

export function useKpiData(basePath = './data') {
  const isLoading = ref(true)
  const error = ref(null)

  const _summary = ref([])
  const _channels = ref([])
  const _categories = ref([])
  const _geo = ref([])

  const currentWeek = computed(() => {
    if (!_summary.value.length) return null
    const maxYear = Math.max(..._summary.value.map((r) => Number(r.year)))
    const inYear = _summary.value.filter((r) => Number(r.year) === maxYear)
    const maxWeek = Math.max(...inYear.map((r) => Number(r.week)))
    return { week: maxWeek, year: maxYear }
  })

  const summary = computed(() => {
    if (!currentWeek.value || !_summary.value.length) return null
    const row = _summary.value.find(
      (r) =>
        Number(r.week) === currentWeek.value.week &&
        Number(r.year) === currentWeek.value.year,
    )
    if (!row) return null

    const fatturato = toNum(row.fatturato)
    const fatturato_prev = toNum(row.fatturato_prev)
    const ordini = toNum(row.ordini)
    const ordini_prev = toNum(row.ordini_prev)
    const tasso_conversione = toNum(row.tasso_conversione)
    const tasso_conversione_prev = toNum(row.tasso_conversione_prev)
    const ticket_medio = toNum(row.ticket_medio)
    const ticket_medio_prev = toNum(row.ticket_medio_prev)

    return {
      fatturato,
      fatturato_delta: delta(fatturato, fatturato_prev),
      ordini,
      ordini_delta: delta(ordini, ordini_prev),
      tasso_conversione,
      tasso_conversione_delta: delta(tasso_conversione, tasso_conversione_prev),
      ticket_medio,
      ticket_medio_delta: delta(ticket_medio, ticket_medio_prev),
    }
  })

  const channels = computed(() => {
    if (!currentWeek.value) return []
    return _channels.value
      .filter(
        (r) =>
          Number(r.week) === currentWeek.value.week &&
          Number(r.year) === currentWeek.value.year,
      )
      .map((r) => ({
        canale: r.canale,
        fatturato: toNum(r.fatturato),
        ordini: toNum(r.ordini),
        tasso_conversione: toNum(r.tasso_conversione),
      }))
      .sort((a, b) => b.fatturato - a.fatturato)
  })

  const categories = computed(() => {
    if (!currentWeek.value) return []
    return _categories.value
      .filter(
        (r) =>
          Number(r.week) === currentWeek.value.week &&
          Number(r.year) === currentWeek.value.year,
      )
      .map((r) => {
        const fatturato = toNum(r.fatturato)
        const fatturato_prev = toNum(r.fatturato_prev)
        const ordini = toNum(r.ordini)
        const ordini_prev = toNum(r.ordini_prev)
        return {
          categoria: r.categoria,
          fatturato,
          ordini,
          fatturato_delta: delta(fatturato, fatturato_prev),
          target_fatturato: toNum(r.target_fatturato),
          stato: r.stato || 'in_target',
        }
      })
      .sort((a, b) => b.fatturato - a.fatturato)
  })

  const geoData = computed(() => {
    if (!currentWeek.value) return []
    return _geo.value
      .filter(
        (r) =>
          Number(r.week) === currentWeek.value.week &&
          Number(r.year) === currentWeek.value.year,
      )
      .map((r) => ({ code: r.code.trim().toUpperCase(), value: toNum(r.value) }))
  })

  async function load() {
    try {
      isLoading.value = true
      error.value = null
      const base = basePath.replace(/\/$/, '')
      const [sumText, chanText, catText, geoText] = await Promise.all([
        fetchCsv(`${base}/kpi_summary.csv`),
        fetchCsv(`${base}/kpi_by_channel.csv`),
        fetchCsv(`${base}/kpi_by_category.csv`),
        fetchCsvOptional(`${base}/geo_kpi.csv`),
      ])
      _summary.value = parseCsv(sumText)
      _channels.value = parseCsv(chanText)
      _categories.value = parseCsv(catText)
      _geo.value = geoText ? parseCsv(geoText) : []
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  load()

  return { currentWeek, summary, channels, categories, geoData, isLoading, error }
}
