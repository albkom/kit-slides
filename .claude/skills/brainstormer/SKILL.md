---
name: brainstormer
description: Aiuta a esplorare nuovi argomenti, valutare idee, affrontare decisioni tecniche, focalizzare sugli aspetti chiave per l'argomento in questione e per il progetto nella sua visione e chiarire scope e responsabilità prima di iniziare a costruire.
---

## Trigger

Usa questa skill quando vuoi esplorare un nuovo argomento, valutare un'idea, affrontare una decisione tecnica, o chiarire scope e responsabilità prima di iniziare a costruire.

## Setup — prima di rispondere

1. Leggi `.claude/knowledge/CONTEXT.md` — capisce il progetto, lo stack e i tre livelli di componenti
2. Leggi `.claude/knowledge/DECISIONS.md` — capisce le scelte già fatte (non riaprirle senza motivo)
3. Leggi `.claude/agile/SCRUM.md` — conosce le convenzioni per le issue
4. Leggi `.claude/agile/LABELS.md` — conosce le label, il nome repo e le aree del progetto

---

## Fase 1 — Chiarire lo scope

Prima di esplorare soluzioni, fai domande mirate per capire esattamente cosa si sta affrontando. Non andare avanti finché non hai risposte chiare a queste tre cose:

1. **Problema reale:** cosa non funziona o cosa manca oggi?
2. **Confine:** cosa è dentro scope, cosa è fuori?
3. **Livello coinvolto:** riguarda il kit (slide built-in / `kpi/` / `ui/`), il deck consumer, o l'infrastruttura (PDF, task, build)?

Fai una domanda alla volta. Non elencare tutte le domande insieme — aspetta la risposta prima di procedere alla successiva.

Se l'utente va fuori scope, segnalalo esplicitamente: *"Questo mi sembra fuori dallo scope che abbiamo definito — vuoi allargarlo o teniamo il confine?"*

Se l'utente propone di modificare file interni del kit per esigenze di un singolo deck, segnalalo: *"Stai considerando di modificare un file del kit — vale la pena verificare prima se i tre livelli di componenti (slide built-in → `kpi/` → `ui/`) possono già coprire il bisogno."*

---

## Fase 2 — Esplorare

Solo dopo aver chiarito scope e responsabilità, esplora le opzioni. Per ogni opzione significativa:

- Descrivi cosa risolve
- Descrivi il trade-off principale
- Indica l'effort stimato (basso / medio / alto)
- Se esiste già un ADR correlato in `knowledge/DECISIONS.md`, citalo

Massimo 3 opzioni — se ne vedi di più, seleziona le più rilevanti. Non presentare tutte le possibilità teoriche.

Alla fine della fase 2 dai una raccomandazione chiara con motivazione. Non lasciare l'utente a scegliere senza un punto di vista.

---

## Fase 3 — Output: issue GitHub

Quando la sessione di brainstorming ha prodotto qualcosa di concreto e azionabile, genera automaticamente una o più issue pronte per GitHub.

Per ogni issue, mostra prima il riepilogo (titolo + labels), poi il body in un blocco di codice markdown copiabile direttamente in GitHub:

**Formato output:**

```
---
### [Titolo issue]

**Labels:** `tipo` `area/...`
**Milestone:** (se applicabile)

**Body** (copia in GitHub):

​```markdown
## Contesto
...

## Cosa fare
...

## Acceptance criteria
- [ ] ...

## Note
(se necessario)
​```
---
```

**Regole per le issue:**

- Titolo sempre come azione: "Aggiungere X", "Correggere Y", "Estrarre Z"
- Labels sempre dalla combinazione di `SCRUM.md` (tipo + urgenza) e `LABELS.md` (area)
- Il body deve essere in un blocco ```markdown``` separato — pronto da copiare senza modifiche
- Se dalla sessione emergono più issue distinte, generale tutte — una per responsabilità
- Se qualcosa è ancora troppo vago per diventare issue, dillo esplicitamente invece di generare un'issue vaga

---

## Fase 4 — Output: TASKS.md per Claude Code

Dopo aver generato le issue, genera un unico file `TASKS.md` da salvare in `.claude/TASKS.md` nel repo.

Il file contiene tutte le task della sessione in sequenza — una per responsabilità, separate da `---`. Serve come istruzione operativa per Claude Code: deve essere autosufficiente, senza ambiguità, leggibile da un agente senza contesto aggiuntivo.

**Formato output** (un blocco markdown unico da copiare in `.claude/TASKS.md`):

```markdown
# TASKS — [Titolo breve della sessione]

> Generato da sessione brainstorming del [data].
> Issue di riferimento: #N, #M (se già aperte)

---

## Task 1 — [Titolo]

### Contesto
Sintesi minima del problema. Solo quello che serve per implementare.

### Obiettivo
Cosa deve essere vero al termine di questa task.

### Step

#### 1. [Titolo step]
- Cosa fare in dettaglio
- File coinvolti (path esatti se noti)
- Vincoli o note implementative

#### 2. [Titolo step]
...

### Verifica finale
- [ ] Criterio verificabile 1
- [ ] Criterio verificabile 2

### Fuori scope
Cosa NON fare in questa task.

---

## Task 2 — [Titolo]

...
```

**Regole per TASKS.md:**

- Le task devono essere ordinate per dipendenza — prima quella che sblocca le altre
- Gli step di ogni task devono indicare i file coinvolti se noti
- La sezione "Fuori scope" è obbligatoria se dalla sessione sono emerse cose escluse esplicitamente
- Non generare TASKS.md se la sessione non ha prodotto nulla di abbastanza concreto da implementare

---

## Comportamento generale

- Fai domande mirate, non elenchi di domande
- Segnala sempre quando si sta uscendo dallo scope
- Non proporre soluzioni prima di aver capito il problema
- Non generare issue o TASKS.md se la sessione non ha prodotto nulla di concreto e azionabile
- Se una decisione è già in `knowledge/DECISIONS.md`, non riaprirla — fai riferimento all'ADR esistente
- Quando la soluzione coinvolge il kit, verifica sempre che il livello corretto di componenti sia usato (slide built-in → `kpi/` → `ui/`)
