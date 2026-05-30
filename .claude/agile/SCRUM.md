# SCRUM

> Convenzioni generiche per la gestione del lavoro su GitHub Issues.
> Non contiene nulla di specifico a un progetto — il contesto progetto arriva da `CONTEXT.md` e `LABELS.md`.

---

## Filosofia

- Una issue per ogni cosa che potresti dimenticare, anche piccola
- Il titolo è sempre un'azione: "Aggiungere X" non "X"
- Se non riesci a scrivere l'acceptance criteria, il task non è ancora pronto
- Chiudi le issue con commit linkati (`closes #42`) — costruisce la storia del progetto

---

## Label — dimensioni fisse

Due dimensioni fisse (`tipo` + `area`) e una opzionale (`critical`):

### Tipo
| Label | Uso |
|---|---|
| `bug` | Qualcosa non funziona come dovrebbe |
| `enhancement` | Nuova feature o miglioramento di una esistente |
| `refactor` | Cambiamento interno senza impatto sul comportamento |
| `docs` | Solo documentazione |
| `chore` | Task tecnico, infrastruttura, dipendenze |

### Urgenza
| Label | Uso |
|---|---|
| `critical` | Da fare prima delle altre — aggiungila solo se serve davvero ricordarselo |

### Area
Definita per progetto in `.claude/LABELS.md`.

---

## Struttura issue

### Titolo
```
[Tipo] Azione concisa
```
Esempi:
- `[enhancement] Aggiungere validazione input nel form di registrazione`
- `[bug] Il pulsante di conferma non risponde su mobile`
- `[refactor] Estrarre logica di autenticazione in composable`

### Corpo
```markdown
## Contesto
Perché questa issue esiste. Cosa succede oggi.

## Cosa fare
Descrizione chiara dell'intervento.

## Acceptance criteria
- [ ] criterio misurabile 1
- [ ] criterio misurabile 2

## Note
(opzionale) Link, riferimenti, decisioni correlate.
```

---

## Milestones

Usate come sprint leggeri. Una milestone = un blocco di lavoro con scadenza.

- Nome breve e descrittivo: `v0.1 — contratto pubblico stabile`
- Scadenza sempre presente — anche se indicativa
- Chiudi la milestone solo quando tutte le issue sono chiuse o esplicitamente spostate

---

## Cosa non fare

- Non creare label che non usi — meglio 8 usate che 20 abbandonate
- Non aprire issue vaghe senza acceptance criteria
- Non usare la board Projects per ora — aggiunge friction senza dare molto a un solo developer
