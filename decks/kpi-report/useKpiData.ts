import { ref, computed } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type {
  IAdapter,
  RawSummaryRow,
  RawChannelRow,
  RawCategoryRow,
  RawGeoRow,
  KpiSummary,
  KpiChannel,
  KpiCategory,
  KpiStato,
  GeoDataPoint,
  WeekRef,
} from '../../src/types'

const STATI: KpiStato[] = ['in_target', 'attenzione', 'sotto_target']

function toNum(v: string | number | null | undefined): number {
  const n = parseFloat(String(v ?? '').replace(',', '.'))
  return isNaN(n) ? 0 : n
}

function delta(current: number, prev: number): number | null {
  if (!prev || prev === 0) return null
  return ((current - prev) / Math.abs(prev)) * 100
}

export interface UseKpiDataResult {
  currentWeek: ComputedRef<WeekRef | null>
  summary: ComputedRef<KpiSummary | null>
  channels: ComputedRef<KpiChannel[]>
  categories: ComputedRef<KpiCategory[]>
  geoData: ComputedRef<GeoDataPoint[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
}

export function useKpiData(adapter: IAdapter): UseKpiDataResult {
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  const _summary = ref<RawSummaryRow[]>([])
  const _channels = ref<RawChannelRow[]>([])
  const _categories = ref<RawCategoryRow[]>([])
  const _geo = ref<RawGeoRow[]>([])

  const currentWeek = computed<WeekRef | null>(() => {
    if (!_summary.value.length) return null
    const maxYear = Math.max(..._summary.value.map((r) => Number(r.year)))
    const inYear = _summary.value.filter((r) => Number(r.year) === maxYear)
    const maxWeek = Math.max(...inYear.map((r) => Number(r.week)))
    return { week: maxWeek, year: maxYear }
  })

  const summary = computed<KpiSummary | null>(() => {
    if (!currentWeek.value || !_summary.value.length) return null
    const cw = currentWeek.value
    const row = _summary.value.find(
      (r) => Number(r.week) === cw.week && Number(r.year) === cw.year,
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

  const channels = computed<KpiChannel[]>(() => {
    if (!currentWeek.value) return []
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
      .sort((a, b) => b.oks - a.oks)
  })

  const categories = computed<KpiCategory[]>(() => {
    if (!currentWeek.value) return []
    const cw = currentWeek.value
    return _categories.value
      .filter((r) => Number(r.week) === cw.week && Number(r.year) === cw.year)
      .map<KpiCategory>((r) => {
        const fatturato = toNum(r.fatturato)
        const fatturato_prev = toNum(r.fatturato_prev)
        const ordini = toNum(r.ordini)
        const stato: KpiStato = STATI.includes(r.stato as KpiStato)
          ? (r.stato as KpiStato)
          : 'in_target'
        return {
          categoria: r.categoria,
          fatturato,
          ordini,
          fatturato_delta: delta(fatturato, fatturato_prev),
          target_fatturato: toNum(r.target_fatturato),
          stato,
        }
      })
      .sort((a, b) => b.fatturato - a.fatturato)
  })

  const geoData = computed<GeoDataPoint[]>(() => {
    if (!currentWeek.value) return []
    const cw = currentWeek.value
    return _geo.value
      .filter((r) => Number(r.week) === cw.week && Number(r.year) === cw.year)
      .map((r) => ({
        code: r.code.trim().toUpperCase(),
        value: toNum(r.value),
      }))
  })

  async function load() {
    try {
      isLoading.value = true
      error.value = null
      const [s, ch, cat, geo] = await Promise.all([
        adapter.fetchSummary(),
        adapter.fetchChannels(),
        adapter.fetchCategories(),
        adapter.fetchGeo(),
      ])
      _summary.value = s
      _channels.value = ch
      _categories.value = cat
      _geo.value = geo ?? []
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
    } finally {
      isLoading.value = false
    }
  }

  load()

  return {
    currentWeek,
    summary,
    channels,
    categories,
    geoData,
    isLoading,
    error,
  }
}
