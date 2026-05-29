import { markRaw } from "vue";
import Cover from "./slides/Cover.vue";
import ExampleCharts from "./slides/ExampleCharts.vue";
import ExampleMetrics from "./slides/ExampleMetrics.vue";
import ExampleDataMap from "./slides/ExampleDataMap.vue";
import type { DeckSlide } from "kit-slides";
import { deckConfig } from "./deck.config";

export interface BuildSlidesInput {
  week: number;
  year: number;
}

export function buildSlides({ week, year }: BuildSlidesInput): DeckSlide[] {
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
      component: markRaw(ExampleCharts),
      props: {},
    },
    {
      component: markRaw(ExampleMetrics),
      props: {},
    },
    {
      component: markRaw(ExampleDataMap),
      props: {},
    },
  ];
}
