# 🍱 Bento Cheatsheet — KIT Slides

`BentoSlide` + `BentoCard` sono primitive di layout pensate per **comporre** card asimmetriche con qualunque componente del kit (KPI, sparkline, badge, tabelle, charts) o markup arbitrario.

Importi diretti dall'entry point:

```ts
import { BentoSlide, BentoCard } from 'kit-slides'
import type { BentoSize, BentoTone } from 'kit-slides'
```

---

## 1. Setup minimo

```vue
<script setup lang="ts">
import { BentoSlide, BentoCard } from '../../../index'
</script>

<template>
  <BentoSlide title="Dashboard" meta="W42 · 2025">
    <BentoCard size="2x2" eyebrow="Revenue" title="€ 184K" />
    <BentoCard size="1x1" eyebrow="Utenti" title="12.4K" />
    <BentoCard size="1x1" eyebrow="CVR"    title="3.7%" />
    <BentoCard size="2x1" eyebrow="Trend"  title="Ultime 12w" />
  </BentoSlide>
</template>
```

La griglia di default è **4 colonne**. Le righe si dimensionano automaticamente sull'altezza disponibile della slide.

---

## 2. BentoSlide — props

| Prop      | Tipo      | Default | Effetto                               |
|-----------|-----------|---------|---------------------------------------|
| `title`   | `string`  | `''`    | Titolo nell'header della slide        |
| `meta`    | `string`  | `''`    | Sottotitolo / contesto a destra       |
| `columns` | `number`  | `4`     | Numero di colonne della griglia bento |
| `gap`     | `string`  | `'1rem'`| Spazio tra le card (qualsiasi unità CSS) |

```vue
<BentoSlide :columns="6" gap="1.5rem" title="Layout largo">
  <!-- … card su 6 colonne … -->
</BentoSlide>
```

---

## 3. BentoCard — sizing

Due meccanismi, **intercambiabili**:

### Preset shorthand `size="<col>x<row>"`

```vue
<BentoCard size="2x1" />   <!-- larga 2 colonne, alta 1 riga -->
<BentoCard size="1x2" />   <!-- stretta, alta 2 righe -->
<BentoCard size="2x2" />   <!-- hero quadrata -->
<BentoCard size="3x2" />   <!-- arbitraria — qualsiasi NxM -->
```

### Escape hatch numerico

```vue
<BentoCard :col-span="3" :row-span="2" />
```

> Se entrambi sono presenti, **`size` vince**. Default: `1x1`.

---

## 4. BentoCard — tone

Stili tonali pubblici, restilizzabili dai temi:

| Tone        | Uso tipico                                  |
|-------------|---------------------------------------------|
| `default`   | Card neutra (surface + border)              |
| `primary`   | Evidenzia il KPI hero                       |
| `accent`    | Sfondo `--brand-light`, per richiami soft   |
| `muted`     | Sfondo grigio tenue per gruppi secondari    |
| `dark`      | Inverso — testo chiaro su fondo brand-dark  |

```vue
<BentoCard tone="primary" size="2x2" eyebrow="Revenue" title="€ 184K" />
<BentoCard tone="dark"    size="1x1" eyebrow="SLA"     title="99.95%" />
```

---

## 5. BentoCard — slot

Tre slot, tutti opzionali:

| Slot      | Quando usarlo                                  |
|-----------|------------------------------------------------|
| `header`  | Sostituisce eyebrow + title con markup custom  |
| _default_ | Body della card (composizione libera)          |
| `footer`  | Caption, source, link in basso                 |

```vue
<BentoCard size="2x1">
  <template #header>
    <span class="bento-card__eyebrow">Trend</span>
    <span class="bento-card__title">Ultime 12 settimane</span>
  </template>

  <Sparkline :values="weekly" :width="320" :height="60" fill />

  <template #footer>Fonte: warehouse · aggiornato 12:00 UTC</template>
</BentoCard>
```

Se non passi `header`, le prop `eyebrow` e `title` riempiono l'header built-in.

---

## 6. Composizione — esempi pratici

### KPI hero con sparkline + delta

```vue
<BentoCard size="2x2" tone="primary" eyebrow="Revenue" title="€ 184.2K">
  <Sparkline :values="trend" :width="320" :height="120" fill />
  <div style="display: flex; align-items: center; gap: 0.5rem;">
    <DeltaBadge :value="12.4" />
    <span class="bento-card__footer">vs. settimana precedente</span>
  </div>
</BentoCard>
```

### Lista di status

```vue
<BentoCard size="3x1" tone="muted" eyebrow="Servizi" title="Health">
  <ul style="margin:0; padding:0; list-style:none;
             display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.4rem;">
    <li v-for="s in services" :key="s.name"
        style="display:flex; justify-content:space-between; font-size: var(--txt-s);">
      <span>{{ s.name }}</span>
      <StatusBadge :status="s.status" />
    </li>
  </ul>
</BentoCard>
```

### KpiCard riusato dentro una bento

```vue
<BentoCard size="2x1">
  <KpiCard
    label="Conversion rate"
    value="3.7%"
    :delta="-1.2"
    :pie-data="pieData"
  />
</BentoCard>
```

### Quote / callout

```vue
<BentoCard size="2x2" tone="accent">
  <template #header><span class="bento-card__eyebrow">Insight</span></template>
  <blockquote style="font-size: var(--txt-l); line-height: 1.3; margin: 0;">
    "Il churn è sceso del 18% dopo il rollout del nuovo onboarding."
  </blockquote>
  <template #footer>— Customer Success Team</template>
</BentoCard>
```

---

## 7. Personalizzare l'aspetto dal `theme.css`

Le card bento rispettano i token pubblici (`--surface`, `--border`, `--slide-radius`, `--brand-*`, `--text-*`). Cambiare il tema cambia anche le bento — di solito non serve altro.

Per override puntuali, usa le classi pubbliche:

```css
/* decks/my-deck/theme.css */
.bento-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.bento-card--primary {
  border-width: 2px;
  border-color: var(--brand-primary);
}

.bento-card--dark {
  background: linear-gradient(135deg, #0f172a, #1e293b);
}
```

Anche `--bento-cols`, `--bento-gap` sono token CSS (settati inline da `BentoSlide`) — sovrascrivibili a livello di slide:

```css
.slide-bento.my-variant {
  --bento-gap: 0.5rem;
}
```

---

## 8. Pattern consigliati

- **Hero 2×2 + tre 1×1**: KPI principale grande, secondari piccoli accanto. Layout "above the fold" classico.
- **Hero 2×2 + 2×1 wide + 3×1 lista**: aggiunge un trend e una lista di status, riempie 4×3.
- **Quattro 1×1 + due 2×1**: griglia compatta per dashboard ad alta densità.
- **Mix tone**: `primary` per il KPI principale, `default` per i metric tiles, `muted` per sezioni di supporto, `dark` per un'unica metrica "executive".

> Su una slide 1280×720 con 4 colonne e gap 1rem, una card 1×1 è ~270×140 px. Riempi senza esagerare con il testo: chart + numero + delta è già pieno.

---

## 9. Pitfall

- **Overflow**: la slide ha dimensioni fisse (1280×720). Se il contenuto della card sfora, viene tagliato (`overflow: hidden`). Usa `Sparkline` con `width/height` espliciti o `font-size` controllati.
- **Span > columns**: una card con `colSpan` maggiore di `columns` viene comunque renderizzata, ma occupa l'intera riga. Non lancia errori.
- **Slot vuoti**: se passi solo `eyebrow`/`title` senza body, l'header riempie comunque la card — utile per metric tile minimal.
- **`tone="dark"` su tema chiaro**: il testo viene invertito automaticamente; se aggiungi figli custom (es. un proprio `<span>`), ricorda che il colore di default è scuro — applica `color: inherit` o usa le classi `bento-card__*`.

---

## 10. Workflow consigliato

```bash
# Scaffold deck nuovo (usa il tema corporate, comodo per bento)
task new NAME=my-bento-deck
echo '@import "../../src/styles/themes/corporate.css";' > decks/my-bento-deck/theme.css

# Dev server
task dev NAME=my-bento-deck

# Export PDF
KIT_DECK=my-bento-deck task pdf
```

Per un esempio completo end-to-end vedi `decks/bento-demo/`.
