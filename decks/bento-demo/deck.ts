import { markRaw } from "vue";
import type { SlideDefinition } from "kit-slides";
import Cover from "./slides/Cover.vue";
import Showcase from "./slides/Showcase.vue";
import { deckConfig, type SlideKey } from "./deck.config";

export function buildSlides(): SlideDefinition[] {
  const slideBuilders: Record<SlideKey, () => SlideDefinition[]> = {
    cover: () => [
      {
        component: markRaw(Cover),
        props: {
          title: deckConfig.title,
          subtitle: deckConfig.subtitle,
          badge: deckConfig.badge,
        },
        isCover: true,
      },
    ],
    showcase: () => [
      {
        component: markRaw(Showcase),
        props: { columns: deckConfig.bentoColumns },
      },
    ],
  };

  return deckConfig.slideOrder
    .filter((key) => key in slideBuilders)
    .flatMap((key) => slideBuilders[key]());
}
