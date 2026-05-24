import { markRaw } from "vue";
import Cover from "./slides/Cover.vue";
import Showcase from "./slides/Showcase.vue";
import ShowcaseObserver from "./slides/ShowcaseObserver.vue";
import Table from "./slides/Table.vue";
import type { SlideDefinition } from "kit-slides";
import { deckConfig } from "./deck.config";

export interface BuildSlidesInput {
  week: number;
  year: number;
}

const serverNames = [
  "Server-AAA",
  "Server-BBB",
  "Server-CCC",
  "Server-DDD",
  "Server-EEE",
  "Server-FFF",
];

export function buildSlides({
  week,
  year,
}: BuildSlidesInput): SlideDefinition[] {
  const slides: SlideDefinition[] = [];
  slides.push({
    component: markRaw(Cover),
    isCover: true,
    props: {
      week,
      year,
      title: deckConfig.title,
      subtitle: deckConfig.subtitle,
      badge: deckConfig.badge,
    },
  });

  serverNames.forEach((serverName) =>
    slides.push({
      component: markRaw(ShowcaseObserver),
      title: `Performance di ${serverName}`,
      props: {
        serverName,
      },
    }),
  );

  slides.push({
    component: markRaw(Showcase),
    props: {},
  });

  slides.push({
    component: markRaw(Table),
    props: {},
  });

  return slides;
}
