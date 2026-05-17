# KIT Slides

Toolkit Vue 3 + Vite per costruire deck di slide 16:9 stampabili in PDF.
Un deck è un'app indipendente in `decks/<nome>/`: ogni deck sceglie il
proprio data adapter, le proprie slide e il proprio tema.

Il kit fornisce:

- un motore di rendering (`SlideDeck`, `Slide`)
- slide generiche built-in (`CoverSlide`, `KpiSlide`, `TableSlide`,
  `ChartSlide`, `MapSlide`) — vedi [`docs/slides.md`](docs/slides.md)
- UI atoms riusabili (`KpiCard`, `DeltaBadge`, `StatusBadge`)
- un composable per il data binding KPI (`useKpiData`)
- scaffolding via `task new`
- export PDF deterministico via Puppeteer (`task pdf`)
- theming via CSS variables — vedi [`docs/theming.md`](docs/theming.md)

## Prerequisiti

- **Node.js 18+**
- **pnpm 9+** — `npm install -g pnpm`
- **task** (go-task) — `https://taskfile.dev/installation/`

## Installazione

```bash
git clone https://github.com/albkom/kit-slides.git
cd kit-slides
pnpm install
```

## Quick start

```bash
# Scaffold di un nuovo deck (copia templates/starter → decks/my-talk)
task new NAME=my-talk

# Avvia dev server con HMR
task dev NAME=my-talk         # default: kpi-report se NAME omesso

# Esporta a PDF (slides.pdf alla root)
task pdf
```

| Comando                       | Descrizione                                          |
|-------------------------------|------------------------------------------------------|
| `task install`                | `pnpm install`                                       |
| `task new NAME=<deck>`        | Scaffold di un nuovo deck da `templates/starter`     |
| `task dev NAME=<deck>`        | Dev server (default `kpi-report`)                    |
| `task dev:pdf NAME=<deck>`    | Dev server + auto-export PDF su ogni save            |
| `task build NAME=<deck>`      | Build di produzione in `dist/`                       |
| `task preview`                | Preview del build                                    |
| `task pdf`                    | Export PDF one-shot (exit code 1 in caso di errore)  |

## Struttura

```
kit-slides/
├── src/
│   ├── components/
│   │   ├── SlideDeck.vue, Slide.vue     ← motore
│   │   ├── slides/                       ← slide generiche built-in (S.1)
│   │   │   ├── CoverSlide.vue
│   │   │   ├── KpiSlide.vue
│   │   │   ├── TableSlide.vue
│   │   │   ├── ChartSlide.vue
│   │   │   └── MapSlide.vue
│   │   └── ui/                           ← atomi (KpiCard, DeltaBadge, …)
│   ├── composables/useKpiData.ts
│   ├── styles/                           ← SCSS + _tokens.scss (CSS vars)
│   └── types.ts                          ← tipi pubblici
├── decks/
│   ├── kpi-report/                       ← deck di riferimento (KPI settimanali)
│   └── minimal-pitch/                    ← esempio di deck minimale
├── templates/
│   └── starter/                          ← copiato da `task new`
├── scripts/
│   └── export-pdf.js
├── docs/
│   ├── slides.md                         ← API delle slide built-in
│   └── theming.md                        ← CSS variables pubbliche
├── CHANGELOG.md
├── Taskfile.yml
└── vite.config.js
```

## Aggiungere o aggiornare i dati (deck `kpi-report`)

I CSV vivono in `decks/kpi-report/public/data/`. Il deck legge automaticamente
la **settimana con il numero più alto** presente nei file. Se mancano colonne
o file, l'UI mostra un messaggio d'errore e `task pdf` esce con `1`.

### `kpi_areas.csv` — una riga per settimana

```
week,year,fatturato,fatturato_prev,ordini,ordini_prev,tasso_conversione,tasso_conversione_prev,ticket_medio,ticket_medio_prev
21,2026,325000,318750,2180,2104,3.9,3.8,149.08,151.50
```

### `kpi_by_channel.csv` — una riga per canale

```
name,total,oks,kos,draws,kpi_1,kpi_2,kpi_3
Organico,1200,870,200,130,4.6,2.1,5.3
```

### `performance.csv` — una riga per categoria per settimana

`stato` accetta: `in_target` | `attenzione` | `sotto_target`.

```
week,year,categoria,fatturato,fatturato_prev,ordini,ordini_prev,target_fatturato,stato
21,2026,Abbigliamento,98000,94500,710,692,92000,in_target
```

### `geo_kpi.csv` (opzionale) — performance geografica

```
week,year,code,value
21,2026,IT,120000
21,2026,FR,80000
```

## Personalizzare un deck

- **Tema**: edita `decks/<deck>/theme.css`. Viene caricato automaticamente —
  non serve importarlo nel `main.ts`. Vedi [`docs/theming.md`](docs/theming.md)
  per la lista dei token pubblici stabili.
- **Slide custom**: crea componenti in `decks/<deck>/slides/` e usali in
  `deck.ts`. Le slide custom hanno accesso a tutti gli atomi e alle slide
  generiche del kit.
- **Adapter dati custom**: implementa `IAdapter` (vedi
  `decks/kpi-report/adapters/csvAdapter.ts` per un esempio).

## Versioning

Il kit segue [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Per
la policy completa (cosa è MAJOR vs MINOR vs PATCH) e lo storico delle
modifiche, vedi [`CHANGELOG.md`](CHANGELOG.md).

In breve:

- **MAJOR**: cambia API pubblica delle slide built-in, dei tipi esportati da
  `index.ts`, dei token CSS marcati `/* @public */` in `_tokens.scss`,
  o del contratto `IAdapter` / `SlideDefinition`.
- **MINOR**: nuove slide, nuovi tipi, nuove opzioni di config, nuovi token
  pubblici — sempre retro-compatibili.
- **PATCH**: bug fix, doc, refactor interni.
