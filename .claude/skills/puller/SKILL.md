---
name: puller
description: Genera il testo di una Pull Request prima del merge — titolo, descrizione, cambiamenti principali e checklist. Usa questa skill quando vuoi scrivere o preparare una PR.
---

# puller

## Trigger

Usa questa skill quando vuoi generare il testo di una Pull Request prima del merge.

## Setup — prima di rispondere

1. Leggi `.claude/CONTEXT.md` — capisce il progetto e lo stack
2. Leggi `.claude/TASK.md` se presente — è la fonte principale delle informazioni
3. Leggi la issue GitHub di riferimento se disponibile

---

## Comportamento

Genera un testo di PR sintetico. Non un riassunto del codice — una comunicazione chiara di cosa cambia e perché.

Principio: chi legge la PR deve capire in 30 secondi cosa fa e se è sicuro mergiarla.

---

## Formato output

```
## Cosa fa questa PR
[1-2 frasi. Cosa cambia nel comportamento o nella struttura. No dettagli tecnici.]

## Perché
[1-2 frasi. Il problema che risolve o la feature che aggiunge. Collega alla issue.]

## Cambiamenti principali
- [file o area toccata]: [cosa è cambiato, una riga]
- ...

## Note per la review
[Opzionale. Solo se c'è qualcosa che merita attenzione: trade-off accettati, cosa è stato escluso deliberatamente, dipendenze da altri task.]

## Checklist
- [ ] sync-knowledge eseguito
- [ ] TASK.md eliminato da .claude/
- [ ] closes #N
```

---

## Regole

- Massimo 150 parole totali — se superi, taglia
- Niente elenchi di ogni singolo file modificato — solo i cambiamenti rilevanti
- Niente gergo da commit message ("refactor X to use Y") — scrivi per un lettore umano
- Se non hai abbastanza contesto per riempire una sezione, lasciala fuori piuttosto che inventare
