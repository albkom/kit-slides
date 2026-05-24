import { markRaw } from "vue";
import Cover from "./slides/Cover.vue";
import Showcase from "./slides/Showcase.vue";
import Table from "./slides/Table.vue";
import type { SlideDefinition, GeoDataPoint } from "kit-slides";
import type { KpiAreaComputed, KpiChannel, PerformanceComputed } from "./types";
import { areasByName, sortByUsage } from "./selectors";
import { deckConfig } from "./deck.config";

export interface BuildSlidesInput {
  areas: KpiAreaComputed[];
  channels: KpiChannel[];
  performance: PerformanceComputed[];
  geoData: GeoDataPoint[];
  week: number;
  year: number;
}

export function buildSlides({
  areas,
  channels,
  performance,
  geoData,
  week,
  year,
}: BuildSlidesInput): SlideDefinition[] {
  return [
    {
      component: markRaw(Cover),
      isCover: true,
      props: {
        week,
        year,
        title: deckConfig.title,
        subtitle: deckConfig.subtitle,
        badge: deckConfig.badge,
      },
    },
    {
      component: markRaw(Showcase),
      props: { geoData, areas: areasByName(areas), channels, week, year },
    },
    {
      component: markRaw(Table),
      props: { performance: sortByUsage(performance) },
    },
  ];
}
