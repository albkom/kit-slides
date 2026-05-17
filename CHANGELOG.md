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
