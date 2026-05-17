# kit-slides

![license](https://img.shields.io/badge/license-MIT-blue) ![node](https://img.shields.io/badge/node-%E2%89%A518-brightgreen) ![pnpm](https://img.shields.io/badge/pnpm-%E2%89%A59-orange)

Toolkit Vue 3 + Vite per costruire deck di slide 16:9 stampabili in PDF, pensato per report KPI ricorrenti e pitch tecnici.

## Prerequisiti

- **Node.js 18+**
- **pnpm 9+** — `npm install -g pnpm`
- **task** (go-task) — [istruzioni di installazione](https://taskfile.dev/installation/)

## Installazione

```bash
git clone https://github.com/<your-org>/kit-slides.git
cd kit-slides
pnpm install
```

## Guida rapida: dal clone al primo PDF

**Passo 1 — Avvia il deck di esempio (`kpi-report`)**

```bash
task dev
```

Apri [http://localhost:5173](http://localhost:5173).

**Passo 2 — Esporta in PDF**

```bash
task pdf
```

Trovi `slides.pdf` nella root del progetto.

**Passo 3 — Crea il tuo primo deck**

```bash
task new NAME=my-talk
task dev NAME=my-talk
```

Modifica `decks/my-talk/deck.ts` per aggiungere o riordinare le slide.

## Struttura del progetto

```
kit-slides/
├── src/
│   ├── components/
│   │   ├── SlideDeck.vue, Slide.vue     ← motore di rendering
│   │   ├── slides/                       ← slide generiche built-in
│   │   │   ├── CoverSlide.vue
│   │   │   ├── KpiSlide.vue
│   │   │   ├── TableSlide.vue
│   │   │   ├── ChartSlide.vue
│   │   │   └── MapSlide.vue
│   │   └── ui/                           ← atomi (KpiCard, DeltaBadge, …)
│   ├── composables/
│   │   ├── useKpiData.ts                 ← data binding KPI
│   │   └── types.ts                      ← tipi adapter + data shape
│   ├── styles/                           ← SCSS + _tokens.scss (CSS vars)
│   └── types.ts                          ← tipi pubblici core
├── decks/
│   ├── kpi-report/                       ← deck di riferimento
│   └── minimal-pitch/                    ← esempio minimale
├── templates/
│   └── starter/                          ← copiato da `task new`
├── scripts/
│   └── export-pdf.js                     ← export PDF via Puppeteer
├── docs/
│   ├── slides.md                         ← API delle slide built-in
│   └── theming.md                        ← CSS variables pubbliche
├── CHANGELOG.md
├── LICENSE
├── Taskfile.yml
└── vite.config.js
```

## Comandi disponibili

| Comando                    | Descrizione                                          |
|----------------------------|------------------------------------------------------|
| `task install`             | `pnpm install`                                       |
| `task new NAME=<deck>`     | Scaffold di un nuovo deck da `templates/starter`     |
| `task dev NAME=<deck>`     | Dev server (default `kpi-report`)                    |
| `task dev:pdf NAME=<deck>` | Dev server + auto-export PDF su ogni save            |
| `task build NAME=<deck>`   | Build di produzione in `dist/`                       |
| `task preview`             | Preview del build                                    |
| `task pdf`                 | Export PDF one-shot (exit code 1 in caso di errore)  |

## Usare le slide built-in

Le slide generiche (`CoverSlide`, `KpiSlide`, `TableSlide`, `ChartSlide`, `MapSlide`) si importano da `kit-slides` e si compongono in `deck.ts`. Esempio minimo:

```ts
// decks/my-talk/deck.ts
import { markRaw } from "vue";
import { CoverSlide, TableSlide } from "../../index";
import type { SlideDefinition } from "../../index";

export function buildSlides(): SlideDefinition[] {
  return [
    {
      component: markRaw(CoverSlide),
      props: { title: "Q2 2026 Review", subtitle: "Analytics & Reporting" },
      isCover: true,
    },
    {
      component: markRaw(TableSlide),
      props: {
        title: "Performance per canale",
        columns: [
          { key: "name", label: "Canale" },
          { key: "oks",  label: "OK", align: "right" },
        ],
        rows: [
          { name: "Organico", oks: 870 },
          { name: "Paid",     oks: 612 },
        ],
      },
    },
  ];
}
```

Per la documentazione completa di props e config, vedi [`docs/slides.md`](docs/slides.md).

## Dati: collegare i propri CSV

I CSV vivono in `decks/<deck>/public/data/`. Quando `VITE_DATA_SOURCE=csv` (default), il `CsvAdapter` li carica automaticamente al boot del deck e `useKpiData` deriva da loro la settimana corrente.

Per cambiare sorgente dati (REST API, host locale C#) vedi le variabili in [`.env.example`](.env.example): copia il file in `.env` e decommenta la configurazione desiderata.

## Theming

Crea o modifica `decks/<deck>/theme.css` e sovrascrivi le CSS variables (`--brand-primary`, `--surface`, `--font-stack`, …). Il file viene auto-iniettato — non serve importarlo in `main.ts`.

Per la lista completa dei token pubblici stabili vedi [`docs/theming.md`](docs/theming.md).

## Aggiungere una slide custom

1. Crea un componente Vue in `decks/<deck>/slides/MySlide.vue`.
2. Importalo in `deck.ts`: `import MySlide from "./slides/MySlide.vue"`.
3. Aggiungilo all'array restituito da `buildSlides`: `{ component: markRaw(MySlide), props: { … } }`.
4. (Opzionale) Riusa atomi come `KpiCard`, `DeltaBadge`, `StatusBadge` importandoli da `kit-slides`.

Dettagli e API in [`docs/slides.md`](docs/slides.md).

## Contribuire / aprire issue

Bug e richieste: apri una issue sul repo GitHub. PR benvenute — descrivi nel messaggio cosa cambia e perché.

## Licenza

MIT — vedi [LICENSE](LICENSE).
