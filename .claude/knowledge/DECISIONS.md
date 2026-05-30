# kit-slides — DECISIONS

> Registro delle scelte architetturali rilevanti. Prima di cambiare qualcosa di strutturale, controlla se esiste un ADR che spiega perché è così.

---

## ADR-001 — pnpm workspace + local path invece di npm publish

**Perché:** zero setup per repo privati, cambiamenti nel kit si riflettono immediatamente nei deck.
**Trade-off:** nessuna distribuzione esterna. npm publish rimandato a quando il contratto pubblico è stabile.

---

## ADR-002 — IAdapter è un'interfaccia marker vuota

**Perché:** il kit non deve sapere nulla del dominio del consumer. Ogni deck definisce la propria `IKpiAdapter extends IAdapter` con i metodi concreti.
**Trade-off:** meno scaffolding automatico; il consumer parte da zero, ma è completamente libero sulla shape dei dati.

---

## ADR-003 — CSS variables come API pubblica del tema

**Perché:** un solo punto di override in `theme.css`, ereditato da tutti i componenti. Nessun prop tema da gestire componente per componente.
**Trade-off:** meno type-safety; i token interni (non elencati in `_tokens.scss`) possono cambiare senza preavviso.
**Regola:** se un token non è in `_tokens.scss` (marcato `/* @public */`), non è API pubblica — non farci affidamento.

---

## ADR-004 — Deck switcher rimosso dall'API pubblica

**Perché:** era un artifact del dev environment (`__KIT_DECKS__`, `__KIT_CURRENT_DECK__` sono dettagli implementativi del Vite plugin), non una feature del kit. Routing e selezione deck sono responsabilità del consumer via Vue Router.
**Trade-off:** il consumer implementa il proprio switcher. Guadagno: contratto pubblico più semplice.

---

## ADR-005 — Tre livelli di componenti: slide built-in / kpi/ / ui/

**Perché:** le esigenze dei deck variano molto. Slide built-in coprono il caso comune; i componenti `kpi/` permettono composizione intermedia senza creare slide built-in ad hoc; gli atomi `ui/` danno controllo granulare.
**Trade-off:** più superficie pubblica da mantenere. Guadagno: il consumer non deve mai forcare il kit per layout custom.
**Regola:** usare il livello più alto che soddisfa il bisogno — slide built-in → componenti `kpi/` → atomi `ui/`, nell'ordine.

---

## ADR-006 — Raw* types restano nel deck, non nel kit

**Perché:** i tipi `Raw*` (es. `RawSummaryRow`) sono artefatti del parsing CSV/REST, specifici del deck. Esportarli dal kit creava un coupling inutile e tipi pubblici che non appartengono al contratto del kit.
**Trade-off:** ogni deck ridefinisce i propri `Raw*` internamente.
**Regola:** i tipi di dominio normalizzati (`AreaRow`, `ChannelRow`, ecc.) vivono in `examples/<nome>/types.ts`. I tipi config pubblici del kit (`KpiCardDef`, `ColumnDef`, `ChartData<T>`) si importano da `kit-slides`.

---

## ADR-007 — Selectors come funzioni pure nel deck

**Perché:** la logica di filtro/riordino dei dati è specifica del deck, non del kit. Tenerla in `selectors.ts` nel deck la rende testabile in isolamento e separa le responsabilità da `deck.ts` e dai composables.
**Trade-off:** un po' di boilerplate iniziale. Guadagno: `deck.ts` resta dichiarativo, i composables restano di binding.
**Regola:** l'adapter fa solo fetch + normalizzazione; i selectors fanno filtri e riordini; i composables orchestrano tutto.

---

## ADR-008 — theme.css iniettato automaticamente da Vite

**Perché:** il consumer non deve ricordarsi di importare il tema in `main.ts`. La convenzione di percorso (`examples/<deck>/theme.css`) è sufficiente.
**Trade-off:** magic implicita — il consumer deve sapere che il file viene caricato automaticamente.
**Regola:** non importare `theme.css` manualmente nel `main.ts` del deck; viene già iniettato.

---

## Come aggiungere una decisione

```
## ADR-00N — Titolo breve

**Perché:** contesto e motivazione.
**Trade-off:** cosa si perde o si accetta.
**Regola:** (opzionale) vincolo operativo che ne deriva.
```
