# kit-slides — CONTEXT

## Cos'è

Vue 3 component library per costruire deck di slide con dati, KPI e PDF export.
Struttura **library + consumer**: `kit-slides` è la lib, ogni `decks/<nome>/` è un consumer autonomo.

Obiettivo: un senior Vue dev arriva al primo PDF funzionante in < 15 minuti.

## Stack

| Layer      | Tecnologia                   |
|------------|------------------------------|
| Framework  | Vue 3 + Composition API      |
| Language   | TypeScript                   |
| Build      | Vite                         |
| Stili      | CSS variables + SCSS tokens  |
| PDF export | Puppeteer (`task pdf`)       |
| Package    | pnpm workspace, local path   |

## Struttura repo

```
kit-slides/               ← la lib (packages/kit-slides/)
  src/
    components/
      SlideDeck.vue       ← motore di rendering con toolbar
      Slide.vue
      slides/             ← CoverSlide, KpiSlide, TableSlide, ChartSlide, MapSlide, QuoteSlide
      kpi/                ← MetricBlock, MetricGroup, RatioBar, RankTable, BarComparison,
                             StatusGrid, ThresholdMeter, Sparkline, WeeklyTrend
      bento/              ← BentoSlide, BentoCard
      ui/                 ← KpiCard, DeltaBadge, StatusBadge, ProgressBadge
    styles/
      _tokens.scss        ← CSS variables pubbliche (marcate /* @public */)
      themes/             ← corporate.css, cyberpunk.css  (temi built-in)
    composables/
      useKpiData.ts       ← esportato da kit-slides

decks/<nome>/             ← consumer (non fa parte del kit)
  deck.ts                 ← composizione e ordine delle slide
  theme.css               ← override CSS variables (caricato auto da Vite)
  types.ts                ← tipi di dominio + re-export da kit-slides
  adapters/               ← CsvAdapter, RestApiAdapter, ecc.
  composables/            ← useKpiData, useDashboardStore, ecc.
  selectors.ts            ← funzioni pure per filtri e riordini
  slides/                 ← componenti slide custom del deck

templates/starter/        ← template copiato da `task new`
scripts/
  export-pdf.js           ← export PDF via Puppeteer (exit 1 se errore UI)
docs/
  slides.md               ← API delle slide built-in e dei componenti kpi/
  theming.md              ← CSS variables pubbliche + guide al theming
```

## Componenti chiave

- `SlideDeck` — motore di rendering con toolbar (print, infinite scroll toggle); riceve `SlideDefinition[]`
- `SlideBase` / `SlideSection` — primitive per slide custom
- `IAdapter` — interfaccia marker vuota; ogni deck la estende con i propri metodi concreti (es. `IKpiAdapter extends IAdapter`)

## I tre livelli del kit

1. **Slide built-in** (`slides/`) — caso comune; props tipizzate (`KpiCardDef[]`, `ColumnDef[]`, ecc.)
2. **Componenti KPI** (`kpi/`) — primitive intermedie composabili in slide custom senza toccare il kit
3. **Atomi UI** (`ui/`) — controllo granulare per layout completamente custom

## Temi built-in

- `corporate.css` — neutri muted, indaco/slate, angoli arrotondati
- `cyberpunk.css` — palette scura, neon, clip-path angolari

Uso: una riga `@import` nel `theme.css` del deck, poi override puntuali sotto.

## Stato attuale

- [x] Slide built-in generiche (Cover, KPI, Table, Chart, Map, Quote)
- [x] Componenti `kpi/` (9 componenti) e `bento/`
- [x] Sistema temi via CSS variables + temi built-in
- [x] `task new / dev / dev:pdf / build / pdf`
- [x] Deck `starter` funzionante come template di riferimento
- [x] Validazione dati malformati con exit code non-zero
- [x] `useKpiData` esportato dall'entry point `kit-slides`
- [ ] npm publish (obiettivo futuro, quando il contratto pubblico è stabile)

## Come avviare

```bash
pnpm install
task new NAME=my-deck
task dev NAME=my-deck
task pdf NAME=my-deck
```

## Comandi disponibili

| Comando                                      | Descrizione                                             |
|----------------------------------------------|---------------------------------------------------------|
| `task playground`                            | Dev server component explorer (no CSV richiesto)        |
| `task new NAME=<deck>`                       | Scaffold nuovo deck da `templates/starter`              |
| `task new:from SOURCE=<deck> NAME=<nuovo>`   | Copia deck esistente, esclude `public/data/`            |
| `task dev NAME=<deck>`                       | Dev server (default: `starter`)                         |
| `task dev:pdf NAME=<deck>`                   | Dev server + auto-export PDF su ogni save               |
| `task build NAME=<deck>`                     | Build di produzione in `dist/`                          |
| `task pdf NAME=<deck>`                       | Export PDF one-shot (exit 1 se errore o dati malformati) |

## Regola fondamentale

Import sempre da `kit-slides`, mai da `kit-slides/src/...`
