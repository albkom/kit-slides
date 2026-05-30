# Theming

Il kit espone i propri token visivi come **CSS variables** definite in
[`packages/kit-slides/src/styles/_tokens.scss`](../packages/kit-slides/src/styles/_tokens.scss).
Personalizza il tuo deck sovrascrivendole in `examples/<deck>/theme.css`.

## Setup

Il file `theme.css` è **caricato automaticamente** da Vite — non importarlo in `main.ts`.

```css
/* examples/my-deck/theme.css */
:root {
  --font-stack:    "Inter", system-ui, sans-serif;
  --brand-primary: #2a7;
}
```

Per usare un font Google, aggiungilo in `examples/<deck>/index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
```

## Token pubblici (API stabile)

| Variabile          | Default            | Uso                                          |
|--------------------|--------------------|----------------------------------------------|
| `--font-stack`     | `Roboto, …`        | Font stack globale                           |
| `--brand-primary`  | `#185fa5`          | Bordi, link, accenti, spinner                |
| `--brand-accent`   | `#931d9e`          | Divider cover, evidenze                      |
| `--brand-dark`     | `#7c0c4b`          | Sfondo cover, titoli                         |
| `--brand-light`    | `#e6f1fb`          | Hover righe tabella, sfondi tenui            |
| `--text-primary`   | `#1a1a1a`          | Testo principale                             |
| `--text-secondary` | `#6b7280`          | Meta, label, slide-number                    |
| `--surface`        | `#f8f8f7`          | Sfondo di ogni slide                         |
| `--border`         | `rgba(0,0,0,0.08)` | Card, righe tabella, divisori                |
| `--status-ok`      | `#1d9e75`          | Badge "in_target"                            |
| `--status-warn`    | `#d97706`          | Badge "attenzione"                           |
| `--status-bad`     | `#dc2626`          | Badge "sotto_target"                         |
| `--slide-padding`  | `3rem`             | Padding interno slide                        |
| `--slide-radius`   | `12px`             | Raggio angoli card e box                     |

## Scala tipografica

Cinque passi usati in tutto il kit. Sovrascrivibili e usabili come classi CSS.

| Token / Classe        | Default    | Uso tipico                        |
|-----------------------|------------|-----------------------------------|
| `--txt-xs` / `.txt-xs`| `0.625rem` | Note, hint, badge arrow           |
| `--txt-s`  / `.txt-s` | `0.75rem`  | Label, meta, slide-number         |
| `--txt-m`  / `.txt-m` | `1rem`     | Corpo testo, tabelle              |
| `--txt-l`  / `.txt-l` | `1.5rem`   | Sottotitoli, KPI value            |
| `--txt-xl` / `.txt-xl`| `2rem`     | Titoli slide                      |

```css
/* Scala più grande per proiezioni */
:root {
  --txt-xs: 0.7rem;  --txt-s: 0.85rem;
  --txt-m:  1.1rem;  --txt-l: 1.65rem;  --txt-xl: 2.2rem;
}
```

## Sfondo slide

Il token `--surface` controlla il colore base; `background-image` aggiunge il pattern a puntini.

```css
/* Rimuovi il pattern */
.slide { background-image: none; }

/* Sfondo con gradiente */
.slide {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  background-image: none;
}
```

## Stili per tipo slide

```css
.slide-cover { background: linear-gradient(135deg, #1e3a5f 0%, #4a1942 100%); }
.cover-deco  { display: none; }  /* rimuovi decorazione cerchio */
```

## Esempio completo — tema "Dark Ocean"

```css
/* examples/dark-ocean/theme.css */
:root {
  --font-stack:    "Inter", system-ui, sans-serif;
  --txt-xs: 0.7rem;  --txt-s: 0.85rem;
  --txt-m:  1.1rem;  --txt-l: 1.65rem;  --txt-xl: 2.2rem;

  --brand-primary: #38bdf8;
  --brand-accent:  #818cf8;
  --brand-dark:    #0f172a;
  --brand-light:   #1e3a5f;

  --text-primary:   #f1f5f9;
  --text-secondary: #94a3b8;
  --surface:        #1e293b;
  --border:         rgba(255, 255, 255, 0.08);

  --slide-padding: 3.5rem;
  --slide-radius:  16px;
}
.slide { background-image: none; }
```

## Token interni (NON sovrascrivere)

| Variabile           | Motivo                                              |
|---------------------|-----------------------------------------------------|
| `--slide-w`         | Rompe scaling e PDF export (1280px fisso)           |
| `--slide-h`         | Come sopra (720px fisso)                            |
| `--status-*-bg`     | Calcolati per contrasto — cambiarli rompe i badge   |
