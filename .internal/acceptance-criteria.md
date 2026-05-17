# Acceptance Criteria — kit-slides

> Documento interno. Definisce cosa kit-slides deve essere e come si misura.
> Aggiornare in sincronia con le breaking change del contratto pubblico.

---

## Confini del progetto

**Dentro kit-slides:**
- Motore di rendering (`SlideDeck`, `Slide`)
- Componenti UI atomici (`KpiCard`, `DeltaBadge`, `StatusBadge`)
- Slide built-in generiche (`CoverSlide`, `TableSlide`, `ChartSlide`, `KpiSlide`, `MapSlide`, `QuoteSlide`, …)
- Adapter built-in (`CsvAdapter`, `RestApiAdapter`, `LocalCSharpAdapter`)
- Interfaccia `IAdapter` come contratto estendibile
- Sistema di stili, temi e variabili CSS pubbliche
- Infrastruttura PDF (Puppeteer + `task pdf`)
- Scaffold per nuovi deck (`task new`)

**Fuori (responsabilità del consumer):**
- Componenti slide specifici del dominio
- `deck.ts` — composizione e ordine delle slide
- Configurazione adapter — quale fonte dati usare
- I dati stessi (CSV, DB, API)
- Logica di trasformazione dati (tra adapter e slide)
- Adapter custom se i built-in non bastano
- Override del tema
- Logica condivisa tra deck (es. `shared/`)

---

## Baseline

Gli AC assumono un **senior Vue developer** come consumer. Conosce Vue 3, Composition API, TypeScript. Non conosce kit-slides.

---

## Workflow 1 — Dal nulla al primo PDF

**AC 1.1 — Installazione**
Un senior Vue developer riesce ad aggiungere kit-slides come dipendenza e ad avere il dev server funzionante entro 15 minuti, usando solo il README.

**AC 1.2 — Scaffold**
`task new NAME=my-deck` produce una struttura funzionante che si avvia senza errori e mostra slide placeholder nel browser.

**AC 1.3 — Adapter**
Il consumer riesce a collegare i propri CSV all'adapter built-in modificando solo la configurazione, senza toccare il codice di kit-slides.

**AC 1.4 — Composizione deck**
Il consumer riesce a definire un deck con almeno 3 slide built-in diverse modificando solo `deck.ts`.

**AC 1.5 — Preview**
Le slide nel browser sono fedeli al PDF generato — nessuna differenza di layout o contenuto visibile.

**AC 1.6 — Generazione PDF**
`task pdf` produce un PDF valido, una pagina per slide, senza intervento manuale.

---

## Workflow 2 — Aggiornamento di kit-slides

> Stato attuale: kit-slides viene distribuito localmente. Gli AC 2.x sono target — descrivono dove si vuole arrivare con il versioning.

**AC 2.1 — Versioning semantico**
Kit-slides segue semver. Una breaking change incrementa il major. Una nuova feature il minor. Un fix il patch.

**AC 2.2 — CHANGELOG**
Ogni release ha un CHANGELOG che elenca esplicitamente le breaking change e le istruzioni di migrazione, prima che il consumer aggiorni.

**AC 2.3 — Non-breaking update**
Il consumer aggiorna la versione di kit-slides, esegue `pnpm install`, e il deck funziona senza modifiche. Nessun errore TypeScript, nessuna differenza visiva.

**AC 2.4 — Breaking update**
Il consumer legge il CHANGELOG prima di aggiornare e sa esattamente quali file del proprio repo deve modificare. Dopo le modifiche indicate, il deck funziona e `typecheck` passa.

---

## Workflow 3 — Estensione

**AC 3.1 — Adapter custom**
Il consumer implementa `IAdapter` e lo passa a `useKpiData` senza modificare kit-slides. Il deck funziona identicamente a uno con adapter built-in.

**AC 3.2 — Slide custom**
Il consumer crea un componente Vue e lo aggiunge al `deck.ts` come qualsiasi slide built-in. La slide viene renderizzata e inclusa nel PDF senza configurazione aggiuntiva.

**AC 3.3 — Tema custom**
Il consumer sovrascrive le CSS variables pubbliche e le classi pubbliche documentate. Il risultato è visivamente coerente e sopravvive a un aggiornamento non-breaking di kit-slides.

**AC 3.4 — Isolamento**
Una slide custom o un adapter custom non richiedono mai di modificare file interni di kit-slides.

---

## Gestione errori

**AC E.1 — Errore adapter**
Se l'adapter non riesce a caricare i dati, l'UI mostra un messaggio che indica la fonte del problema (file mancante, endpoint non raggiungibile). `task pdf` termina con exit code non zero e un messaggio leggibile in console.

**AC E.2 — Dati malformati**
Se i dati arrivano ma mancano colonne attese o i tipi non sono compatibili, l'UI mostra quale campo è problematico. `task pdf` fallisce con indicazione del campo.

**AC E.3 — Props mancanti**
Se una slide built-in riceve props incomplete, l'errore è rilevato a compile time dal typecheck. A runtime, se succede comunque, l'UI mostra quale slide e quale prop sono problematiche invece di crashare silenziosamente.

---

## Slide built-in — contratto props

**AC S.1 — Interfaccia generica**
Ogni slide built-in accetta dati con struttura arbitraria. La slide non assume niente sul dominio — nessun campo hardcodato come `fatturato` o `ordini`.

**AC S.2 — Config di rendering**
Ogni slide built-in espone una prop `config` tipizzata che permette al consumer di definire label, formato e stile dei dati senza creare una slide custom. Esempio per `TableSlide`:

```ts
interface ColumnDef {
  key: string
  label: string
  format?: (value: unknown) => string
  align?: 'left' | 'center' | 'right'
}
```

**AC S.3 — Typecheck**
Le props di ogni slide built-in sono completamente tipizzate. Un consumer che passa dati incompatibili riceve un errore TypeScript a compile time.

**AC S.4 — Documentazione**
Ogni slide built-in ha un esempio minimo funzionante nella documentazione — dati di input, config, e screenshot dell'output.

---

## Multi-deck

**AC M.1 — Indipendenza**
Ogni deck ha il proprio entry point, `deck.ts`, e configurazione adapter. `task dev NAME=deck-a` e `task dev NAME=deck-b` funzionano indipendentemente.

**AC M.2 — Build isolata**
`task pdf NAME=deck-a` genera solo il PDF di quel deck senza toccare gli altri. I deck non si influenzano a vicenda.

**AC M.3 — Condivisione non ostacolata**
Il consumer può creare logica condivisa (adapter, composable, tipi) fuori dalle cartelle dei deck. Kit-slides non impone una struttura che impedisce questo.

**AC M.4 — Tema per deck**
Ogni deck può avere il proprio override del tema senza influenzare gli altri deck nello stesso repo.

---

## Evoluzione futura (fuori scope attuale)

- **Agent-ready** — kit-slides espone una descrizione strutturata dei componenti disponibili, sufficiente a permettere a un agente di costruire un `deck.ts` valido autonomamente.
- **Pubblicazione npm** — kit-slides è pubblicato come pacchetto con release taggata, installabile senza path locale.
