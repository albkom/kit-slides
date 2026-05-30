---
name: product-owner
description: Controlla se l'attuale knowledge è allineata rispetto allo stato attuale del progetto e segnala eventuali problemi o disallineamenti. Si attiva quando sono state fatte modifiche o prima di mergiare una PR.
---

## Trigger

Usa questa skill al termine di ogni sessione di lavoro, dopo il merge di una PR o dopo qualsiasi cambiamento significativo al codice. Obiettivo: mantenere i file `.claude/` sempre in sync con la realtà del repo.

## Setup — prima di iniziare

1. Leggi tutti i file `.claude/` del repo:
   - `CONTEXT.md`
   - `DECISIONS.md`
   - `CONVENTIONS.md`
   - `TODO.md`
2. Esplora il codice modificato di recente (git log, file cambiati nell'ultima PR o sessione)
3. Confronta quello che vedi nel codice con quello che è scritto nei file `.claude/`

---

## Cosa verificare

### CONTEXT.md
- Lo stato del progetto è ancora accurato? (checklist feature completate/in corso)
- Lo stack è cambiato? (nuove dipendenze, tool rimossi)
- La struttura del repo riflette le cartelle reali?
- I comandi (`task dev`, `task pdf`, ecc.) funzionano ancora come descritti?

### DECISIONS.md
- È stato introdotto un pattern nuovo non documentato?
- Una decisione esistente è stata di fatto superata dal codice?
- Sono stati fatti trade-off rilevanti durante l'implementazione?

### CONVENTIONS.md
- Ci sono nuove regole implicite nel codice che non sono scritte?
- Una convention esistente non viene più rispettata — va aggiornata o era un errore?
- Nuovi tipi pubblici, pattern di import, o naming che si ripetono?

### TODO.md
- I task completati in questa sessione sono stati spostati in Done?
- Sono emersi nuovi task durante l'implementazione che non sono ancora tracciati?
- Qualcosa in "In corso" che in realtà è bloccato o abbandonato?

---

## Come riportare

Per ogni file, riporta in questo formato:

```
### CONTEXT.md
✅ In sync — nessuna modifica necessaria

### DECISIONS.md
⚠️  Da aggiornare:
- Aggiungere ADR-005: [descrizione breve della decisione presa]

### CONVENTIONS.md
⚠️  Da aggiornare:
- [regola emersa dal codice che manca]

### TODO.md
⚠️  Da aggiornare:
- Spostare in Done: [task completati]
- Aggiungere: [nuovi task emersi]
```

Dopo il report, chiedi conferma prima di scrivere le modifiche: "Vuoi che aggiorni questi file adesso?"

---

## Comportamento

- Non aggiornare i file senza conferma esplicita
- Se un file è già in sync, dillo chiaramente — non inventare aggiornamenti
- Se trovi una discrepanza significativa tra codice e documentazione, segnalala come ⚠️ anche se non sei sicuro al 100%
- Se `TASK.md` è ancora presente in `.claude/`, ricorda di eliminarlo — il task è concluso
