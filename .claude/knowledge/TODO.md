# kit-slides — TODO

> Backlog piatto. Una riga per task. Sposta in `done` quando completo, non cancellare — serve come storia.
> Priorità: 🔴 bloccante · 🟡 importante · 🟢 nice to have

## In corso

<!-- task attivi ora -->

## Da fare

### Kit

- 🟡 Definire e documentare il contratto pubblico completo (cosa è API stabile vs interno)
- 🟡 Scrivere test per `task new` — verifica che il deck si avvii senza errori
- 🟢 Aggiungere tema `minimal.css` ai temi built-in
- 🟢 Documentare come creare un tema custom da zero

### Infrastruttura

- 🟡 Aggiungere CI: lint + type-check su PR
- 🟢 `task pdf` — migliorare messaggio di errore quando i dati sono malformati

### Futuro (non toccare ora)

- ⬜ npm publish — solo quando il contratto pubblico è stabile (vedi ADR-001)
- ⬜ Adapter concreti oltre il CSV starter (REST, mock avanzato)
- ⬜ Deck switcher — valutare come feature opzionale del consumer

---

## Done

- [x] Slide built-in: CoverSlide, KpiSlide, TableSlide, ChartSlide, MapSlide, QuoteSlide
- [x] Componenti kpi/: MetricGroup, Sparkline, WeeklyTrend, RankTable, BarComparison, StatusGrid, ThresholdMeter
- [x] Layout bento/: BentoSlide, BentoCard + token CSS pubblici (`--bento-cols`, `--bento-gap`)
- [x] Temi built-in: corporate.css, cyberpunk.css
- [x] CSS variables pubbliche (\_tokens.scss)
- [x] Infrastruttura PDF via Puppeteer
- [x] `task new NAME=<deck>` scaffold automatico
- [x] `task new:from SOURCE=<deck> NAME=<nuovo>` — copia deck senza dati
- [x] Deck starter funzionante
- [x] IAdapter ridotto a interfaccia marker vuota (ADR-002)
- [x] Deck switcher rimosso dall'API pubblica (ADR-004)
- [x] Auto-pagination TableSlide — split automatico quando dataset supera `maxTableRows`, titolo con indicatore `i/N`
- [x] `deck.config.ts` — pattern configurazione deck separato da `deck.ts` (introdotto in kpi-report)
- [x] `selectors.ts` — rinominati `sortByUsage`/`sortByName` (erano `topByUsage`/`deliveryByName`); conteggio righe ora responsabilità della pagination
- [x] `docs/bento.md` — documentazione BentoSlide/BentoCard (sostituisce `BENTO-CHEATSHEET.md` eliminato)
- [x] `docs/data-adapters.md` — documentazione CSV, `.env`, adapter pattern
- [x] `BENTO-CHEATSHEET.md` e `CHEATSHEET.md` eliminati dalla root (contenuto migrato in `docs/`)
- [x] `shims.d.ts` rimosso (pulizia TypeScript config)
- [x] Skill `keeper` aggiunta in `.claude/skills/keeper/`
