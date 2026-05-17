# Theming

Il kit espone i propri token visivi come **CSS variables** definite in
[`src/styles/_tokens.scss`](../src/styles/_tokens.scss). Un consumer
personalizza l'aspetto del proprio deck sovrascrivendole in
`decks/<deck>/theme.css`.

## Setup

Crea (o usa quello già scaffoldato da `task new`) il file
`decks/<deck>/theme.css`. Sarà **caricato automaticamente** dal
`vite.config.js` se presente — non serve importarlo manualmente nel `main.ts`
del deck.

```css
/* decks/my-deck/theme.css */
:root {
  --brand-primary: #2a7;
  --brand-dark:    #064;
  --font-stack:    "Inter", system-ui, sans-serif;
}
```

## Token pubblici (API stabile)

I token elencati qui sotto sono **parte del contratto pubblico**. Restano
stabili tra release non-breaking (minor/patch) — vedi `CHANGELOG.md` per ogni
modifica. Token non elencati sono interni e possono cambiare senza preavviso.

| Variabile          | Default      | Uso                                          |
|--------------------|--------------|----------------------------------------------|
| `--brand-primary`  | `#185fa5`    | Colore principale (bordi, link, accenti)     |
| `--brand-accent`   | `#931d9e`    | Colore accento (divider, evidenze)           |
| `--brand-dark`     | `#7c0c4b`    | Sfondo della cover slide, titoli             |
| `--brand-light`    | `#e6f1fb`    | Hover su righe tabella, sfondi tenui         |
| `--text-primary`   | `#1a1a1a`    | Testo principale                             |
| `--text-secondary` | `#6b7280`    | Testo secondario (meta, label)               |
| `--surface`        | `#f8f8f7`    | Sfondo della slide                           |
| `--border`         | `rgba(0,0,0,0.08)` | Bordo card, righe tabella              |
| `--status-ok`      | `#1d9e75`    | Badge "in_target"                            |
| `--status-warn`    | `#d97706`    | Badge "attenzione"                           |
| `--status-bad`     | `#dc2626`    | Badge "sotto_target", slide-error            |
| `--slide-padding`  | `3rem`       | Padding interno della slide                  |
| `--slide-radius`   | `12px`       | Raggio di card e box                         |
| `--font-stack`     | `Roboto, …`  | Font stack di tutto il kit                   |

## Token interni (NON sovrascrivere)

I seguenti token sono usati internamente e potrebbero cambiare senza preavviso:

- `--slide-w`, `--slide-h` — dimensioni del canvas 16:9 (1280×720). Cambiarli
  rompe lo scaling e l'export PDF.
- `--status-ok-bg`, `--status-warn-bg`, `--status-bad-bg` — sfondo dei badge,
  scelti per contrasto con il colore di stato corrispondente.

## Verifica visiva

Dopo aver modificato `theme.css`, avvia il dev server (`task dev NAME=my-deck`)
ed esporta in PDF (`task pdf`) per controllare il rendering definitivo.
