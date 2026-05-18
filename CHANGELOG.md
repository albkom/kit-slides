# Changelog

Tutte le modifiche significative a `kit-slides` sono documentate in questo file.

Il formato segue [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) e il
progetto aderisce a [Semantic Versioning](https://semver.org/spec/v2.0.0.html):

- **MAJOR** — modifiche incompatibili all'API pubblica delle slide built-in,
  ai tipi esportati da `index.ts`, ai token CSS `/* @public */` di
  `_tokens.scss`, o al contratto `IAdapter` / `SlideDefinition`.
- **MINOR** — nuove slide, nuovi tipi, nuove opzioni di config, nuovi token
  pubblici, retro-compatibili.
- **PATCH** — bug fix, miglioramenti interni, documentazione.

---

## [2.0.0] — 2026-05-18

### Breaking changes

- **`IAdapter` contratto rivisto.** I metodi `fecthAreas`, `fetchChannels`,
  `fetchPerformance`, `fetchGeo`, `fetchDelivery` ora restituiscono shape
  **normalizzate e tipate** (`AreaRow`, `ChannelRow`, `PerformanceRow`,
  `GeoRow`, `DeliveryRow`) — campi numerici come `number`, non più stringhe
  da parse. La traduzione dal formato sorgente è responsabilità dell'adapter.
  Migrazione per chi implementa `IAdapter`: convertire i campi a `number`
  dentro l'adapter (vedi `CsvAdapter.fecthAreas` come riferimento).
- **`fetchDelivery` ora ritorna `DeliveryRow[] | null`** (prima: `RawDeliveryRow[]`).
  `null` indica fonte assente/opzionale, coerente con `fetchGeo`.
- **`Raw*Row` rimossi dall'API pubblica.** `RawSummaryRow`, `RawChannelRow`,
  `RawPerformanceRow`, `RawGeoRow`, `RawDeliveryRow` non sono più esportati
  da `kit-slides`. Sono ridiventati tipi interni del deck `kpi-report` (vivono
  in `decks/kpi-report/types.ts`). Migrazione: i consumer che si appoggiavano
  a questi tipi devono importarli dal proprio deck oppure migrare ai nuovi
  tipi normalizzati.
- **`Status` spostato in `src/types.ts`.** Prima viveva implicitamente nel
  deck `kpi-report`; ora è parte del core del kit ed è esportato dall'entry
  point. L'import deve passare da `kit-slides`, non più da
  `decks/kpi-report/types`.
- **`UseKpiDataResult.performance` corretto a `PerformanceComputed[]`**
  (prima dichiarava `KpiPerformance[]` ma esponeva `usage` e `status`).
  Migrazione: chi tipizzava esplicitamente la variabile deve aggiornare il
  tipo. L'inferenza Vue continua a funzionare senza modifiche.

### Added

- **`src/components/kpi/`** — nuova famiglia di componenti semantici
  intermedi tra slide built-in e atomi `ui/`:
  - `MetricBlock`, `MetricGroup`, `RatioBar` (metrics)
  - `RankTable`, `BarComparison` (comparison)
  - `StatusGrid`, `ThresholdMeter` (status)
  - `Sparkline`, `WeeklyTrend` (trend)
- Tipi item esportati: `MetricItem`, `RankRow`, `BarItem`, `StatusItem`,
  `WeeklyPoint`.
- Tipi normalizzati esportati: `AreaRow`, `ChannelRow`, `PerformanceRow`,
  `GeoRow`, `DeliveryRow`.
- `Status` esportato dall'entry point.
- `decks/kpi-report/selectors.ts` — funzioni pure per filtri/riordini dati
  (`topByUsage`, `topByKpi`, `topByOks`, `topGeo`, `deliveryByName`,
  `areasByName`). Esempio di pattern raccomandato per i deck.
- Documentazione: nuova sezione "Componenti KPI" in `docs/slides.md` con API
  e esempi per tutti e 9 i componenti, più la sezione "I tre livelli del kit"
  che descrive quando usare slide built-in vs componenti KPI vs atomi `ui/`.

### Changed

- `KpiSlide` riscritta come composizione di `MetricGroup` + `KpiCard`.
  **API pubblica invariata** (`KpiCardDef[]`): i consumer non devono
  modificare nulla.
- `CsvAdapter` ora è responsabile della traduzione CSV → shape normalizzata
  (prima la conversione `string → number` avveniva in `useKpiData`).
- `useKpiData` semplificato: riceve dati già tipati, smette di chiamare
  `toNum` sui campi numerici, validazione interna ora tipizzata via `keyof`.
- `decks/kpi-report/deck.ts` ora invoca i selettori invece di delegare
  `maxRows` alle slide.
- `decks/kpi-report/types.ts` re-esporta tutto dall'entry point del kit
  (`../../index`) anziché da percorsi interni.
- `decks/kpi-report/slides/*.vue` ora importano tipi e componenti
  esclusivamente dall'entry point `kit-slides`.

### Fixed

- `restApiAdapter` non implementava `fetchPerformance` né `fetchDelivery` e
  faceva riferimento a un `RawCategoryRow` inesistente. Riportato in linea
  con `IAdapter` (body stub passthrough con TODO per il mapping reale).
- `decks/kpi-report/slides/Kpi.vue`: la function `pieDataFor` aveva un tipo
  `NumericChannelField` che includeva campi non presenti su
  `KpiAreaComputed`; corretto a un union puntuale che soddisfa il typecheck.
- `StatusBadge` e `ProgressBadge` non importano più dal deck `kpi-report`
  (cycle/dangling import).

### Removed

- Export pubblici di `RawSummaryRow`, `RawChannelRow`, `RawPerformanceRow`,
  `RawGeoRow`, `RawDeliveryRow` da `kit-slides` (vedi Breaking changes).

## [1.1.0] — 2026-05-17

### Added
- Slide generiche built-in: `CoverSlide`, `KpiSlide`, `TableSlide`,
  `ChartSlide`, `MapSlide` in `src/components/slides/`.
- Tipi di config esportati: `ColumnDef`, `KpiCardDef`, `TableSlideConfig`,
  `KpiSlideConfig`, `ChartSlideConfig`, `CoverSlideConfig`, `MapSlideConfig`,
  `ChartKind`, `ColumnAlign`.
- Composable `useKpiData` esportato da `kit-slides` (precedentemente vincolato
  al deck `kpi-report`).
- Documentazione delle slide built-in (`docs/slides.md`) con esempi.
- Documentazione del theming e token pubblici (`docs/theming.md`).
- Auto-iniezione di `decks/<deck>/theme.css` nell'`index.html` (non serve più
  importarlo manualmente in `main.ts`).
- Validazione delle righe CSV in `useKpiData`: messaggio d'errore esplicito
  che indica file e campo mancante invece di valori `NaN` silenziosi.
- `scripts/export-pdf.js` rileva lo stato di errore dell'UI e termina con
  exit code `1` (prima usciva sempre con `0`).

### Changed
- Le slide di `decks/kpi-report/slides/` sono state riscritte come wrapper
  sottili che usano le slide generiche built-in — dimostrazione del pattern
  consigliato per i consumer.
- `useKpiData` spostato da `decks/kpi-report/useKpiData.ts` a
  `src/composables/useKpiData.ts`.
- Marcati `/* @public */` i token CSS in `_tokens.scss` per distinguere
  l'API stabile da quella interna.

### Removed
- `decks/kpi-report/useKpiData.ts` — usare l'import da `kit-slides`.

## [1.0.0] — 2026-04-01

### Added
- Prima release pubblica di `kit-slides`.
- Motore di rendering: `SlideDeck`, `Slide`.
- UI atoms: `KpiCard`, `DeltaBadge`, `StatusBadge`.
- Adapter dati: `CsvAdapter`, `RestApiAdapter`, `LocalCSharpAdapter`
  (nel deck `kpi-report` di riferimento).
- Scaffold di nuovi deck via `task new NAME=<deck>`.
- Export PDF via Puppeteer (`task pdf`).
- Tema personalizzabile via CSS variables in `decks/<deck>/theme.css`.
