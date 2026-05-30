# kit-slides — Istruzioni Claude

Questa è la cartella di configurazione Claude per il progetto **kit-slides**: Vue 3 component library per costruire deck di slide con dati, KPI e PDF export.

## File di contesto

Leggi questi file prima di lavorare sul progetto:

- `knowledge/CONTEXT.md` — stack, struttura repo, componenti chiave, comandi task
- `knowledge/CONVENTIONS.md` — regole su import, componenti, stili, adapter, tipi, commit
- `knowledge/DECISIONS.md` — ADR (architectural decision records): perché le cose sono fatte così
- `knowledge/TODO.md` — backlog e stato del progetto

## Struttura

```
.claude/
  CLAUDE.md              — questo file
  knowledge/
    CONTEXT.md           — contesto progetto e stack
    CONVENTIONS.md       — regole di codice e documenti
    DECISIONS.md         — ADR architetturali
    TODO.md              — backlog
  agile/
    SCRUM.md             — convenzioni generiche per GitHub Issues
    LABELS.md            — label e aree specifiche del progetto
  skills/
    brainstormer/SKILL.md
  settings.local.json
```

## Regole fondamentali

- Import sempre da `kit-slides`, **mai** da `kit-slides/src/...`
- Non modificare file del kit per esigenze di un singolo deck — usa i tre livelli (slide built-in → `kpi/` → `ui/`)
- Prima di cambiare qualcosa di strutturale, leggi `knowledge/DECISIONS.md` — potrebbe esserci già un ADR
- Token CSS pubblici sono quelli marcati `/* @public */` in `_tokens.scss`; tutti gli altri sono interni
- `theme.css` viene iniettato automaticamente da Vite — non importarlo in `main.ts`

## Comandi rapidi

```bash
pnpm install
task new NAME=<deck>
task dev NAME=<deck>
task pdf NAME=<deck>
```

Vedi `knowledge/CONTEXT.md` per la lista completa dei comandi task.
