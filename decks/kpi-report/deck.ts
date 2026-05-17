import { markRaw } from "vue";
import Cover from "./slides/Cover.vue";
import Kpi from "./slides/Kpi.vue";
import Table from "./slides/Table.vue";
import Map from "./slides/Map.vue";
import type { SlideDefinition, GeoDataPoint } from "../../src/types";
import type {
  KpiAreaComputed,
  KpiChannel,
  KpiPerformance,
  DeliveryComputed,
} from "./types";
import Delivery from "./slides/Delivery.vue";

export interface BuildSlidesInput {
  areas: KpiAreaComputed[];
  delivery: DeliveryComputed[];
  channels: KpiChannel[];
  performance: KpiPerformance[];
  geoData: GeoDataPoint[];
  week: number;
  year: number;
}

export function buildSlides({
  areas,
  delivery,
  channels,
  performance,
  geoData,
  week,
  year,
}: BuildSlidesInput): SlideDefinition[] {
  return [
    { component: markRaw(Cover), props: { week, year }, isCover: true },
    {
      component: markRaw(Kpi),
      props: { areas, channels, week, year }
    },
    { component: markRaw(Map), props: { geoData, week, year } },
    { component: markRaw(Table), props: { performance, week, year } },
    { component: markRaw(Delivery), props: { delivery, week, year } },
  ];
}
