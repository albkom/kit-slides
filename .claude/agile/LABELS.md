# LABELS

## Repo

- **Nome:** `kit-slides`
- **URL:** `https://github.com/<org>/kit-slides`

## Aree

| Label             | Uso                                                        |
| ----------------- | ---------------------------------------------------------- |
| `area/kit`        | Componenti del kit (slides/, kpi/, bento/, ui/)            |
| `area/theming`    | CSS variables, token pubblici, temi built-in               |
| `area/adapter`    | IAdapter, CsvAdapter, RestApiAdapter e normalizzazione dati |
| `area/pdf`        | Export PDF via Puppeteer, scripts/export-pdf.js            |
| `area/dx`         | task new/dev/pdf/build, scaffold, templates/starter        |
| `area/docs`       | docs/, README, CONTEXT.md, CONVENTIONS.md, DECISIONS.md   |
| `area/infra`      | Build Vite, pnpm workspace, CI/CD, dipendenze              |

## Esempi

| Scenario                                    | Labels                              |
| ------------------------------------------- | ----------------------------------- |
| Componente KPI non si renderizza            | `bug` `area/kit`                    |
| PDF export esce con codice 0 su errore UI   | `bug` `critical` `area/pdf`         |
| Aggiungere tema minimal.css                 | `enhancement` `area/theming`        |
| Nuova slide built-in                        | `enhancement` `area/kit`            |
| Migliorare messaggio errore dati malformati | `enhancement` `area/pdf`            |
| Aggiungere CI lint + type-check             | `chore` `area/infra`                |
| Documentare contratto pubblico completo     | `docs` `area/docs`                  |
| Estrarre logica da deck.ts in selectors.ts  | `refactor` `area/adapter`           |
