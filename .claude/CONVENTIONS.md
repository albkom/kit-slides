# kit-slides — CONVENTIONS

> Regole da rispettare nel codice e nei documenti. Se non è scritto qui, chiedi prima di inventare una convenzione.

## Import

- Sempre da `kit-slides`, mai da `kit-slides/src/...`
- Import interni al kit: relativi (`../ui/KpiCard.vue`)
- `examples/<nome>/types.ts` re-esporta tutto da `kit-slides` così il codice del deck ha un solo punto di import

## Componenti

- Nomi in PascalCase: `KpiSlide`, `BentoCard`, `MetricGroup`
- Un componente per file
- Props interamente tipizzate — errore a compile time se mancano

## Stili

- Personalizzazione tema: solo override di CSS variables (e classi pubbliche documentate) in `examples/<nome>/theme.css`
- Temi built-in: aggiungere `@import "../../src/styles/themes/<nome>.css"` come prima riga del `theme.css`, poi override puntuali sotto
- `theme.css` viene iniettato automaticamente da Vite — non importarlo in `main.ts`
- Mai modificare `_tokens.scss` per esigenze di un singolo deck
- Token marcati `/* @public */` in `_tokens.scss` sono API stabile; tutti gli altri sono interni e possono cambiare senza preavviso
- Token interni da non toccare mai: `--slide-w`, `--slide-h` (rompono scaling e PDF), `--status-*-bg` (calcolati per contrasto)

## Adapter

- Ogni deck definisce la propria `I<Nome>Adapter extends IAdapter`
- L'adapter fa solo fetch + normalizzazione, zero logica computed
- Tipi `Raw*` (es. `RawSummaryRow`) vivono nell'adapter del deck — mai esportati dal kit
- Logica computed va nei composables (`useDashboardStore`, ecc.)
- Selettori (filtri, riordini) vanno in `selectors.ts` nel deck — funzioni pure, testabili in isolamento

## Tipi

- Tipi di dominio (es. `AreaRow`, `ChannelRow`) vivono in `examples/<nome>/types.ts` — mai nel kit
- Tipi config pubblici del kit: `KpiCardDef`, `ColumnDef`, `ChartData<T>`, `MetricItem`, `RankRow`, `BarItem`, `StatusItem`, `WeeklyPoint` — sempre importati da `kit-slides`
- Tipi di stato: `Status` esportato da `kit-slides`

## Tre livelli — quando usare quale

1. **Slide built-in** (`CoverSlide`, `KpiSlide`, `TableSlide`, ecc.) — primo tentativo; coprono il caso comune
2. **Componenti KPI** (`MetricGroup`, `Sparkline`, `RankTable`, ecc.) — quando le slide built-in non bastano; si compongono in un Vue custom senza toccare il kit
3. **Atomi UI** (`KpiCard`, `DeltaBadge`, `StatusBadge`, `ProgressBadge`) — controllo granulare (es. celle di tabella ad hoc)

## Task

- `task playground` — dev server component explorer (no CSV richiesto)
- `task new NAME=<deck>` — scaffold nuovo deck
- `task new:from SOURCE=<deck> NAME=<nuovo>` — copia deck esistente, esclude `public/data/`
- `task dev NAME=<deck>` — dev server
- `task dev:pdf NAME=<deck>` — dev server con auto-export PDF
- `task pdf NAME=<deck>` — export PDF (exit non-zero se dati malformati o errore UI)

## Commit

Conventional Commits: `feat:` `fix:` `chore:` `docs:` `refactor:`

## Acceptance criteria minimi

- [ ] `task new` produce un deck che si avvia senza errori
- [x] Un senior Vue dev arriva al primo PDF in < 15 minuti usando solo il README
- [x] `task pdf` esce con codice non-zero se i dati sono malformati o l'UI è in stato di errore
- [x] Cambiare `theme.css` modifica l'aspetto senza toccare il kit
- [x] Nessun import da `kit-slides/src/...` nel codice del deck
- [x] Una slide custom, un componente KPI usato direttamente, o un adapter custom non richiedono mai di modificare file interni di kit-slides

## Configurazione deck

- I deck complessi possono estrarre la configurazione in `examples/<nome>/deck.config.ts` (titolo cover, ordine slide, `maxTableRows`, `topGeoCount`, ecc.)
- `deck.ts` consuma `deck.config.ts` e resta dichiarativo — nessun numero magico inline
