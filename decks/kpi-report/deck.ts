import { markRaw } from 'vue'
import Cover from './slides/Cover.vue'
import Kpi   from './slides/Kpi.vue'
import Chart from './slides/Chart.vue'
import Table from './slides/Table.vue'
import Map   from './slides/Map.vue'
import type {
  SlideDefinition,
  GeoDataPoint,
} from '../../src/types'
import type { KpiAreaComputed, KpiChannel, KpiCategory } from './types'

export interface BuildSlidesInput {
  areas: KpiAreaComputed[]
  channels: KpiChannel[]
  categories: KpiCategory[]
  geoData: GeoDataPoint[]
  week: number
  year: number
}

export function buildSlides({
  areas,
  channels,
  categories,
  geoData,
  week,
  year,
}: BuildSlidesInput): SlideDefinition[] {
  return [
    { component: markRaw(Cover), props: { week, year }, isCover: true },
    { component: markRaw(Kpi),   props: { areas, channels, week, year } },
    { component: markRaw(Chart), props: { channels, week, year } },
    { component: markRaw(Table), props: { categories, week, year } },
    { component: markRaw(Map),   props: { geoData, week, year } },
  ]
}
