# Acceptance Criteria â€” kit-slides

> Documento interno. Definisce cosa kit-slides deve essere e come si misura.
> Aggiornare in sincronia con le breaking change del contratto pubblico.

---

## Confini del progetto

**Dentro kit-slides:**
- Motore di rendering (`SlideDeck`, `Slide`)
- Componenti UI atomici (`KpiCard`, `DeltaBadge`, `StatusBadge`, `ProgressBadge`) in `src/components/ui/`
- **Componenti KPI semantici** in `src/components/kpi/` (`MetricBlock`, `MetricGroup`, `RatioBar`, `RankTable`, `BarComparison`, `StatusGrid`, `ThresholdMeter`, `Sparkline`, `WeeklyTrend`): primitive intermedie usabili standalone, non legate a una specifica slide built-in
- **Layout componibili** in `src/components/bento/` (`BentoSlide`, `BentoCard`): griglia asimmetrica + card slotted, pensate per essere riempite con qualunque componente del kit o markup arbitrario
- Slide built-in generiche (`CoverSlide`, `TableSlide`, `ChartSlide`, `KpiSlide`, `MapSlide`, `QuoteSlide`, â€¦)
- Contratto `IAdapter` come **interfaccia marker vuota**. Il kit non prescrive metodi di fetch nÃ© shape dei dati: il deck estende `IAdapter` con la propria interfaccia (es. `IKpiAdapter`) e definisce le proprie row/computed
- Sistema di stili, variabili CSS pubbliche, e **temi built-in** in `src/styles/themes/` (es. `cyberpunk.css`, `corporate.css`) importabili via `@import` dal `theme.css` del deck
- Infrastruttura PDF (Puppeteer + `task pdf`)
- Scaffold per nuovi deck (`task new`)

**Fuori (responsabilitÃ  del consumer / del deck):**
- Componenti slide specifici del dominio
- `deck.ts` â€” composizione e ordine delle slide
- **Selettori del deck** (`selectors.ts`) â€” funzioni pure per filtri e riordini dei dati prima del rendering; vivono nel deck, non nel kit
- Composable di binding dati (es. `useKpiData`) â€” vive nel deck e orchestra fetch + computed sulle shape del deck
- Tipi di dominio del deck â€” row normalizzate (`AreaRow`, `ChannelRow`, â€¦), shape computed (`KpiAreaComputed`, `PerformanceComputed`, â€¦), `WeekRef`, `AdapterOptions`
- Interfaccia adapter specifica del deck (es. `IKpiAdapter extends IAdapter`) con i metodi di fetch concreti
- Adapter concreti (es. `CsvAdapter` del deck `starter`) â€” usano i tipi `Raw*` interni al deck per il parsing e producono le shape normalizzate definite dal deck
- Configurazione adapter â€” quale fonte dati usare, percorsi, credenziali
- I dati stessi (CSV, DB, API)
- Adapter custom se serve un protocollo non coperto
- Override del tema
- Logica condivisa tra deck (es. `shared/`)

---

## Baseline

Gli AC assumono un **senior Vue developer** come consumer. Conosce Vue 3, Composition API, TypeScript. Non conosce kit-slides.

---

## Workflow 1 â€” Dal nulla al primo PDF

**AC 1.1 â€” Installazione**
Un senior Vue developer riesce ad aggiungere kit-slides come dipendenza e ad avere il dev server funzionante entro 15 minuti, usando solo il README.

**AC 1.2 â€” Scaffold**
`task new NAME=my-deck` produce una struttura funzionante che si avvia senza errori e mostra slide placeholder nel browser.

**AC 1.3 â€” Adapter**
Il consumer riesce a collegare i propri CSV all'adapter built-in modificando solo la configurazione, senza toccare il codice di kit-slides.

**AC 1.4 â€” Composizione deck**
Il consumer riesce a definire un deck con almeno 3 slide built-in diverse modificando solo `deck.ts`.

**AC 1.5 â€” Preview**
Le slide nel browser sono fedeli al PDF generato â€” nessuna differenza di layout o contenuto visibile.

**AC 1.6 â€” Generazione PDF**
`task pdf` produce un PDF valido, una pagina per slide, senza intervento manuale.

---

## Workflow 2 â€” Aggiornamento di kit-slides

> Stato attuale: kit-slides viene distribuito localmente. Gli AC 2.x sono target â€” descrivono dove si vuole arrivare con il versioning.

**AC 2.1 â€” Versioning semantico**
Kit-slides segue semver. Una breaking change incrementa il major. Una nuova feature il minor. Un fix il patch.

**AC 2.2 â€” CHANGELOG**
Ogni release ha un CHANGELOG che elenca esplicitamente le breaking change e le istruzioni di migrazione, prima che il consumer aggiorni.

**AC 2.3 â€” Non-breaking update**
Il consumer aggiorna la versione di kit-slides, esegue `pnpm install`, e il deck funziona senza modifiche. Nessun errore TypeScript, nessuna differenza visiva.

**AC 2.4 â€” Breaking update**
Il consumer legge il CHANGELOG prima di aggiornare e sa esattamente quali file del proprio repo deve modificare. Dopo le modifiche indicate, il deck funziona e `typecheck` passa.

---

## Workflow 3 â€” Estensione

**AC 3.1 â€” Adapter custom**
Il consumer definisce la propria `IKpiAdapter extends IAdapter` con i metodi di fetch specifici del dominio, implementa gli adapter concreti, e crea il proprio `useKpiData` nel deck. Il kit fornisce solo `IAdapter` come interfaccia marker. Il deck Ã¨ autonomo nel definire le shape dei dati e la logica computed.

**AC 3.2 â€” Slide custom da slide built-in**
Il consumer crea un componente Vue che istanzia una slide built-in (es. `KpiSlide`) con dati di dominio mappati a `KpiCardDef[]`. La slide viene renderizzata e inclusa nel PDF senza configurazione aggiuntiva.

**AC 3.3 â€” Slide custom da componenti KPI**
Quando le slide built-in non bastano, il consumer crea un componente Vue che importa direttamente i componenti `kpi/` (es. `MetricGroup`, `Sparkline`) dall'entry point `kit-slides`, li compone in un layout custom, e lo aggiunge al `deck.ts`. Non Ã¨ richiesto creare prima una slide built-in nÃ© estendere il kit.

**AC 3.4 â€” Slide custom da atomi UI**
Il consumer puÃ² costruire una slide custom componendo direttamente atomi `ui/` (`DeltaBadge`, `StatusBadge`, `KpiCard`, `ProgressBadge`) quando il controllo granulare Ã¨ necessario (es. celle di una tabella ad hoc).

**AC 3.5 â€” Tema custom**
Il consumer sovrascrive le CSS variables pubbliche e le classi pubbliche documentate. Il risultato Ã¨ visivamente coerente e sopravvive a un aggiornamento non-breaking di kit-slides.

**AC 3.5b â€” Tema built-in**
Il consumer adotta un tema built-in (`src/styles/themes/<nome>.css`) aggiungendo una sola riga `@import` nel proprio `theme.css`, senza copiare CSS. Eventuali override deck-specific restano nello stesso file, dopo l'import.

**AC 3.6 â€” Isolamento**
Una slide custom, un componente KPI usato direttamente, o un adapter custom non richiedono mai di modificare file interni di kit-slides. Tutti gli import del consumer passano dall'entry point `kit-slides` (mai da `kit-slides/src/...`).

---

## Gestione errori

**AC E.1 â€” Errore adapter**
Se l'adapter non riesce a caricare i dati, l'UI mostra un messaggio che indica la fonte del problema (file mancante, endpoint non raggiungibile). `task pdf` termina con exit code non zero e un messaggio leggibile in console.

**AC E.2 â€” Dati malformati**
Se i dati arrivano ma mancano colonne attese o i tipi non sono compatibili, l'UI mostra quale campo Ã¨ problematico. `task pdf` fallisce con indicazione del campo.

**AC E.3 â€” Props mancanti**
Se una slide built-in riceve props incomplete, l'errore Ã¨ rilevato a compile time dal typecheck. A runtime, se succede comunque, l'UI mostra quale slide e quale prop sono problematiche invece di crashare silenziosamente.

---

## Slide built-in e componenti KPI â€” contratto props

**AC S.1 â€” Interfaccia generica**
Ogni slide built-in e ogni componente KPI accetta dati con struttura arbitraria del dominio del consumer. Nessun campo hardcodato come `fatturato` o `ordini`: i nomi delle prop sono semantici rispetto al ruolo (label, value, delta, status), non al dominio.

**AC S.2 â€” Config di rendering**
Ogni slide built-in espone una prop `config` tipizzata (`ColumnDef[]`, `KpiCardDef[]`, `ChartData`, ecc.). Ogni componente KPI espone prop primitive tipizzate (e, se serve, un tipo `Item` esportato â€” es. `MetricItem`, `RankRow`, `BarItem`, `StatusItem`, `WeeklyPoint`). Esempio per `TableSlide`:

```ts
interface ColumnDef {
  key: string
  label: string
  format?: (value: unknown) => string
  align?: 'left' | 'center' | 'right'
}
```

**AC S.3 â€” Typecheck**
Le props di ogni slide built-in e di ogni componente KPI sono completamente tipizzate. Un consumer che passa dati incompatibili riceve un errore TypeScript a compile time.

**AC S.4 â€” Documentazione**
Ogni slide built-in e ogni componente KPI ha un esempio minimo funzionante in `docs/slides.md` â€” props richieste, esempio di markup, e (per le slide) screenshot dell'output.

---

## Componenti KPI â€” AC dedicati

**AC K.1 â€” Livello intermedio**
I componenti `kpi/` sono primitive di livello intermedio tra slide built-in (intera pagina) e atomi `ui/` (singolo badge). Coprono i layout ricorrenti per cui non esiste una slide built-in dedicata: metric grid, ranking, comparison bar, status grid, threshold, sparkline, trend settimanale.

**AC K.2 â€” Standalone**
Ogni componente `kpi/` Ã¨ utilizzabile fuori da una slide. Il consumer puÃ² importarlo dall'entry point e renderlo in un componente custom, in una slide custom, o in una pagina che non Ã¨ una slide.

**AC K.3 â€” Tipizzazione completa**
Tutte le prop sono tipizzate con TypeScript. I tipi item complessi (`MetricItem`, `RankRow`, `BarItem`, `StatusItem`, `WeeklyPoint`) sono esportati dall'entry point.

**AC K.4 â€” Theming coerente**
I componenti `kpi/` rispettano le CSS variables pubbliche di `_tokens.scss`. Sovrascrivere `--brand-primary`, `--status-ok`, ecc. modifica anche i componenti KPI senza richiedere selettori specifici.

**AC K.5 â€” Esempio funzionante**
Ogni componente KPI ha un esempio minimo eseguibile in `docs/slides.md` â€” props richieste e markup Vue.

---

## Bento â€” AC dedicati

**AC B.1 â€” Layout primitivo**
`BentoSlide` fornisce esclusivamente la griglia (header opzionale + CSS grid). Non assume nulla sul contenuto delle card: il deck riempie la griglia con qualunque combinazione di `BentoCard`, componenti `kpi/`, atomi `ui/`, slide built-in inline o markup arbitrario.

**AC B.2 â€” Sizing flessibile**
`BentoCard` accetta sia la sintassi preset (`size="2x1"`, cols Ã— rows) sia l'escape hatch numerico (`:col-span`, `:row-span`). I due meccanismi sono intercambiabili: il preset, se presente, ha la precedenza.

**AC B.3 â€” Composizione libera**
Lo slot di default di `BentoCard` accetta qualsiasi markup Vue. Gli slot `header` e `footer` permettono di sostituire eyebrow/titolo built-in e di aggiungere caption/source. Nessun vincolo sul tipo di figli.

**AC B.4 â€” Tonal hooks**
`BentoCard` espone una prop `tone` (`default | primary | accent | muted | dark`) che applica classi CSS pubbliche (`.bento-card--<tone>`). I temi (built-in o custom) restano liberi di restyle senza modificare il componente.

**AC B.5 â€” Theming coerente**
Le card bento usano le stesse CSS variables pubbliche (`--surface`, `--border`, `--slide-radius`, `--brand-*`, `--text-*`). Cambiare tema cambia anche l'aspetto delle bento senza tocchi puntuali.

**AC B.6 â€” Standalone**
`BentoSlide` e `BentoCard` sono importabili dall'entry point `kit-slides` e usabili in qualunque slide custom â€” non vincolati a un deck o a un tema specifico.

---

## Multi-deck

**AC M.1 â€” Indipendenza**
Ogni deck ha il proprio entry point, `deck.ts`, e configurazione adapter. `task dev NAME=deck-a` e `task dev NAME=deck-b` funzionano indipendentemente.

**AC M.2 â€” Build isolata**
`task pdf NAME=deck-a` genera solo il PDF di quel deck senza toccare gli altri. I deck non si influenzano a vicenda.

**AC M.3 â€” Condivisione non ostacolata**
Il consumer puÃ² creare logica condivisa (adapter, composable, tipi) fuori dalle cartelle dei deck. Kit-slides non impone una struttura che impedisce questo.

**AC M.4 â€” Tema per deck**
Ogni deck puÃ² avere il proprio override del tema senza influenzare gli altri deck nello stesso repo. Il `theme.css` del deck puÃ² importare un tema built-in (`@import "../../src/styles/themes/<nome>.css"`) e aggiungere override puntuali sotto, oppure restare completamente custom.

---

## Evoluzione futura (fuori scope attuale)

- **Agent-ready** â€” kit-slides espone una descrizione strutturata dei componenti disponibili, sufficiente a permettere a un agente di costruire un `deck.ts` valido autonomamente.
- **Pubblicazione npm** â€” kit-slides Ã¨ pubblicato come pacchetto con release taggata, installabile senza path locale.

