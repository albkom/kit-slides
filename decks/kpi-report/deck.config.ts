/**
 * Configurazione del deck kpi-report.
 * Modifica questo file per cambiare titolo, ordine slide o limiti display.
 * Non richiede di toccare deck.ts né i componenti Vue.
 */

export type SlideKey = "cover" | "kpi" | "map" | "table" | "delivery";

export interface DeckConfig {
  // ── Cover ───────────────────────────────────────────────────────────────
  title: string;
  subtitle?: string;
  badge?: string;

  // ── Ordine slide ────────────────────────────────────────────────────────
  // Rimuovi una voce per escludere la slide dal deck.
  slideOrder: SlideKey[];

  // ── Limiti display ───────────────────────────────────────────────────────
  // Numero massimo di righe per slide di tipo Table. Se i dati superano
  // questa soglia, la slide viene paginata automaticamente e il titolo
  // riceve un indicatore "i/N" (es. "1/3").
  maxTableRows: number;
  topGeoCount: number;
}

export const deckConfig: DeckConfig = {
  title: "Weekly KPI Report",
  subtitle: "Operations & Performance",
  // badge: "CONFIDENTIAL",  // decommenta se serve

  slideOrder: [
    "cover",
    "kpi",
    "map",
    "table",
    "delivery",
  ],

  maxTableRows: 10,
  topGeoCount: 5,
};
