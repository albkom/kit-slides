/**
 * Configurazione del deck bento-demo.
 * Stesso pattern di kpi-report: tutta la config in un solo file.
 */

export type SlideKey = "cover" | "showcase";

export interface DeckConfig {
  title: string;
  subtitle?: string;
  badge?: string;
  slideOrder: SlideKey[];
  bentoColumns: number;
}

export const deckConfig: DeckConfig = {
  title: "Bento Showcase",
  subtitle: "Componenti componibili su griglia asimmetrica",
  badge: "Demo",
  slideOrder: ["cover", "showcase"],
  bentoColumns: 4,
};
