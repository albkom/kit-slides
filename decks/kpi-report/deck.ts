import { markRaw, type Component } from "vue";
import Cover from "./slides/Cover.vue";
import Kpi from "./slides/Kpi.vue";
import Table from "./slides/Table.vue";
import Map from "./slides/Map.vue";
import Delivery from "./slides/Delivery.vue";
import type { SlideDefinition, GeoDataPoint } from "kit-slides";
import type {
  KpiAreaComputed,
  KpiChannel,
  PerformanceComputed,
  DeliveryComputed,
} from "./types";
import { areasByName, sortByUsage, sortByName } from "./selectors";
import { deckConfig, type SlideKey } from "./deck.config";

export interface BuildSlidesInput {
  areas: KpiAreaComputed[];
  delivery: DeliveryComputed[];
  channels: KpiChannel[];
  performance: PerformanceComputed[];
  geoData: GeoDataPoint[];
  week: number;
  year: number;
}

function paginate<T>(rows: readonly T[], pageSize: number): T[][] {
  if (pageSize <= 0 || rows.length <= pageSize) return [[...rows]];
  const pages: T[][] = [];
  for (let i = 0; i < rows.length; i += pageSize) {
    pages.push(rows.slice(i, i + pageSize));
  }
  return pages;
}

function tableSlides<T>(
  component: Component,
  rows: readonly T[],
  dataKey: string,
  baseProps: Record<string, unknown>,
  pageSize: number,
): SlideDefinition[] {
  const pages = paginate(rows, pageSize);
  return pages.map((chunk, i) => ({
    component: markRaw(component),
    props: {
      ...baseProps,
      [dataKey]: chunk,
      pageIndicator: pages.length > 1 ? `${i + 1}/${pages.length}` : undefined,
    },
  }));
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
  const sortedPerformance = sortByUsage(performance);
  const sortedDelivery = sortByName(delivery);

  const slideBuilders: Record<SlideKey, () => SlideDefinition[]> = {
    cover: () => [
      {
        component: markRaw(Cover),
        props: {
          week,
          year,
          title: deckConfig.title,
          subtitle: deckConfig.subtitle,
          badge: deckConfig.badge,
        },
        isCover: true,
      },
    ],
    kpi: () => [
      {
        component: markRaw(Kpi),
        props: { areas: orderedAreas, channels, week, year },
      },
    ],
    map: () => [
      {
        component: markRaw(Map),
        props: { geoData, week, year, topCount: deckConfig.topGeoCount },
      },
    ],
    table: () =>
      tableSlides(
        Table,
        sortedPerformance,
        "performance",
        { week, year },
        deckConfig.maxTableRows,
      ),
    delivery: () =>
      tableSlides(
        Delivery,
        sortedDelivery,
        "delivery",
        { week, year },
        deckConfig.maxTableRows,
      ),
  };

  return deckConfig.slideOrder
    .filter((key) => key in slideBuilders)
    .flatMap((key) => slideBuilders[key]());
}
