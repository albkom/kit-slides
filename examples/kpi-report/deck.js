import { markRaw } from 'vue'
import Cover from './slides/Cover.vue'
import Kpi   from './slides/Kpi.vue'
import Chart from './slides/Chart.vue'
import Table from './slides/Table.vue'
import Map   from './slides/Map.vue'

export function buildSlides({ summary, channels, categories, geoData, week, year }) {
  return [
    { component: markRaw(Cover), props: { week, year } },
    { component: markRaw(Kpi),   props: { summary, channels, week, year } },
    { component: markRaw(Chart), props: { channels, week, year } },
    { component: markRaw(Table), props: { categories, week, year } },
    { component: markRaw(Map),   props: { geoData, week, year } },
  ]
}
