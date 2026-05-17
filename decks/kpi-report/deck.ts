import { markRaw } from 'vue'
import Cover from './slides/Cover.vue'
import Kpi   from './slides/Kpi.vue'
import Chart from './slides/Chart.vue'
import Table from './slides/Table.vue'
import Map   from './slides/Map.vue'
import type {
  SlideDefinition,
  KpiSummary,
  KpiChannel,
  KpiCategory,
  GeoDataPoint,
} from '../../src/types'

export interface BuildSlidesInput {
  summary: KpiSummary
  channels: KpiChannel[]
  categories: KpiCategory[]
  geoData: GeoDataPoint[]
  week: number
  year: number
}

export function buildSlides({
  summary,
  channels,
  categories,
  geoData,
  week,
  year,
}: BuildSlidesInput): SlideDefinition[] {
  return [
    { component: markRaw(Cover), props: { week, year } },
    { component: markRaw(Kpi),   props: { summary, channels, week, year } },
    { component: markRaw(Chart), props: { channels, week, year } },
    { component: markRaw(Table), props: { categories, week, year } },
    { component: markRaw(Map),   props: { geoData, week, year } },
  ]
}
