import { markRaw } from "vue";
import Cover from "./slides/Cover.vue";
import Kpi from "./slides/Kpi.vue";
import Table from "./slides/Table.vue";
import Map from "./slides/Map.vue";
import Delivery from "./slides/Delivery.vue";
import type {
  SlideDefinition,
  GeoDataPoint,
  KpiAreaComputed,
  KpiChannel,
  PerformanceComputed,
  DeliveryComputed,
} from "../../index";
import {
  areasByName,
  topByUsage,
  deliveryByName,
} from "./selectors";

export interface BuildSlidesInput {
  areas: KpiAreaComputed[];
  delivery: DeliveryComputed[];
  channels: KpiChannel[];
  performance: PerformanceComputed[];
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
  const orderedAreas = areasByName(areas);
  const topPerformance = topByUsage(performance, 10);
  const topDelivery = deliveryByName(delivery, 6);

  return [
    { component: markRaw(Cover), props: { week, year }, isCover: true },
    {
      component: markRaw(Kpi),
      props: { areas: orderedAreas, channels, week, year },
    },
    { component: markRaw(Map), props: { geoData, week, year } },
    { component: markRaw(Table), props: { performance: topPerformance, week, year } },
    { component: markRaw(Delivery), props: { delivery: topDelivery, week, year } },
  ];
}
