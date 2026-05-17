# 🎨 Theming Cheatsheet — KIT Slides

Tutte le personalizzazioni vanno nel file `decks/<nome-deck>/theme.css`.  
Il file viene **caricato automaticamente** da Vite — nessun import manuale.

---

## 1. Setup base

```css
/* decks/my-deck/theme.css */
:root {
  --font-stack:    "Inter", system-ui, sans-serif;
  --brand-primary: #2a7;
}
```

---

## 2. Font

```css
/* Cambio typeface su tutto il kit */
:root {
  --font-stack: "Inter", system-ui, sans-serif;
}
```

Per usare un **font Google** aggiungilo prima in `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
```

Esempio serif (stile pitch deck):

```css
:root {
  --font-stack: "Georgia", "Times New Roman", serif;
}
```

---

## 3. Dimensioni testo

La scala tipografica è composta da cinque passi, usati in tutto il kit.  
Aggiungendo le classi `.txt-xs` … `.txt-xl` su qualsiasi elemento HTML ne controlli la dimensione.

| Token / Classe | Default     | Uso tipico                              |
|----------------|-------------|-----------------------------------------|
| `--txt-xs` / `.txt-xs` | `0.625rem` | Note, hint, frecce nei badge   |
| `--txt-s`  / `.txt-s`  | `0.75rem`  | Label, meta, badge, slide-number|
| `--txt-m`  / `.txt-m`  | `1rem`     | Corpo testo, tabelle, meta slide|
| `--txt-l`  / `.txt-l`  | `1.5rem`   | Sottotitoli, KPI value, subtitle|
| `--txt-xl` / `.txt-xl` | `2rem`     | Titoli slide                    |

```css
/* Scala più grande per proiezioni in aule grandi */
:root {
  --txt-xs: 0.7rem;
  --txt-s:  0.85rem;
  --txt-m:  1.1rem;
  --txt-l:  1.65rem;
  --txt-xl: 2.2rem;
}
```

---

## 4. Colori del brand

| Variabile         | Default     | Dove si vede                          |
|-------------------|-------------|---------------------------------------|
| `--brand-primary` | `#185fa5`   | Bordi, link, accenti, spinner         |
| `--brand-accent`  | `#931d9e`   | Divider sulla cover, evidenze         |
| `--brand-dark`    | `#7c0c4b`   | **Sfondo cover**, titoli slide        |
| `--brand-light`   | `#e6f1fb`   | Hover righe tabella, sfondi tenui     |

```css
:root {
  --brand-primary: #0f766e;   /* teal */
  --brand-accent:  #f59e0b;   /* ambra */
  --brand-dark:    #134e4a;   /* teal scuro */
  --brand-light:   #ccfbf1;   /* teal chiarissimo */
}
```

---

## 5. Testo e superfici

| Variabile          | Default            | Dove si vede                    |
|--------------------|--------------------|---------------------------------|
| `--text-primary`   | `#1a1a1a`          | Testo principale                |
| `--text-secondary` | `#6b7280`          | Meta, label, slide-number       |
| `--surface`        | `#f8f8f7`          | **Sfondo di ogni slide**        |
| `--border`         | `rgba(0,0,0,0.08)` | Card, righe tabella, divisori   |

```css
:root {
  --text-primary:   #0f172a;
  --text-secondary: #64748b;
  --surface:        #ffffff;   /* sfondo bianco puro */
  --border:         rgba(0, 0, 0, 0.10);
}
```

---

## 6. Background della slide

Lo sfondo di default ha un pattern a puntini. Per rimuoverlo o cambiarlo:

```css
/* Rimuovi il pattern puntini */
.slide {
  background-image: none;
}

/* Sfondo a tinta unita */
.slide {
  background: #ffffff;
  background-image: none;
}

/* Sfondo con gradiente */
.slide {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  background-image: none;
}
```

> ⚠️ Il token `--surface` controlla il colore base; `background-image` aggiunge il pattern sopra.  
> Per cambiare solo il colore ma tenere il pattern, basta sovrascrivere `--surface`.

---

## 7. Colori di stato (badge)

Usati dai componenti `delta-badge` e `status-badge`.

| Variabile         | Default     | Badge                  |
|-------------------|-------------|------------------------|
| `--status-ok`     | `#1d9e75`   | Testo "in_target"      |
| `--status-warn`   | `#d97706`   | Testo "attenzione"     |
| `--status-bad`    | `#dc2626`   | Testo "sotto_target"   |

> I token `--status-*-bg` (sfondi dei badge) sono **interni** — non sovrascriverli.

---

## 8. Spacing e forma

| Variabile        | Default  | Effetto                              |
|------------------|----------|--------------------------------------|
| `--slide-padding`| `3rem`   | Padding interno di ogni slide        |
| `--slide-radius` | `12px`   | Raggio angoli di card e box          |

```css
/* Slide più ariose, angoli spigolosi */
:root {
  --slide-padding: 5rem;
  --slide-radius:  0px;
}
```

---

## 9. Stili specifici per slide-type

Puoi aggiungere CSS per classi specifiche senza toccare i token:

```css
/* Cover con sfondo personalizzato */
.slide-cover {
  background: linear-gradient(135deg, #1e3a5f 0%, #4a1942 100%);
}

/* Rimuovi decorazione cerchio dalla cover */
.cover-deco {
  display: none;
}
```

---

## 10. Esempio completo — tema "Dark Ocean"

```css
/* decks/dark-ocean/theme.css */
:root {
  --font-stack:    "Inter", system-ui, sans-serif;

  --txt-xs: 0.7rem;
  --txt-s:  0.85rem;
  --txt-m:  1.1rem;
  --txt-l:  1.65rem;
  --txt-xl: 2.2rem;

  --brand-primary: #38bdf8;
  --brand-accent:  #818cf8;
  --brand-dark:    #0f172a;
  --brand-light:   #1e3a5f;

  --text-primary:   #f1f5f9;
  --text-secondary: #94a3b8;
  --surface:        #1e293b;
  --border:         rgba(255, 255, 255, 0.08);

  --slide-padding:  3.5rem;
  --slide-radius:   16px;
}

.slide {
  background-image: none;
}
```

---

## 11. ⛔ Token interni — NON modificare

| Variabile    | Motivo                                          |
|--------------|-------------------------------------------------|
| `--slide-w`  | Rompe lo scaling e l'export PDF (1280px fisso)  |
| `--slide-h`  | Come sopra (720px fisso)                        |
| `--status-*-bg` | Calcolati per contrasto — cambiarli rompe i badge |

---

## Workflow consigliato

```bash
# 1. Avvia il dev server per vedere le modifiche live
task dev NAME=my-deck

# 2. Esporta in PDF per controllare il rendering definitivo
task pdf
```