# BentoSlide / BentoCard

Primitive di layout per comporre card asimmetriche con qualsiasi componente del kit o markup arbitrario.

```ts
import { BentoSlide, BentoCard } from 'kit-slides'
import type { BentoSize, BentoTone } from 'kit-slides'
```

---

## BentoSlide — props

| Prop      | Tipo     | Default  | Effetto                                   |
|-----------|----------|----------|-------------------------------------------|
| `title`   | `string` | `''`     | Titolo nell'header della slide            |
| `meta`    | `string` | `''`     | Sottotitolo / contesto a destra           |
| `columns` | `number` | `4`      | Colonne della griglia                     |
| `gap`     | `string` | `'1rem'` | Spazio tra le card (qualsiasi unità CSS)  |

---

## BentoCard — sizing

### Preset shorthand

```vue
<BentoCard size="2x1" />   <!-- 2 colonne, 1 riga -->
<BentoCard size="1x2" />   <!-- 1 colonna, 2 righe -->
<BentoCard size="2x2" />   <!-- hero quadrata -->
```

### Escape hatch numerico

```vue
<BentoCard :col-span="3" :row-span="2" />
```

Se entrambi sono presenti, `size` vince. Default: `1x1`.

---

## BentoCard — tone

| Tone      | Uso tipico                                  |
|-----------|---------------------------------------------|
| `default` | Card neutra (surface + border)              |
| `primary` | KPI hero                                    |
| `accent`  | Sfondo `--brand-light`, richiami soft       |
| `muted`   | Sfondo grigio tenue, gruppi secondari       |
| `dark`    | Inverso — testo chiaro su fondo brand-dark  |

---

## BentoCard — slot

| Slot      | Quando usarlo                                  |
|-----------|------------------------------------------------|
| `header`  | Sostituisce eyebrow + title con markup custom  |
| _default_ | Body della card                                |
| `footer`  | Caption, source, link in basso                 |

Se non passi `header`, le prop `eyebrow` e `title` riempiono l'header built-in.

---

## Esempio composito

```vue
<script setup lang="ts">
import { BentoSlide, BentoCard, Sparkline, DeltaBadge, StatusBadge } from 'kit-slides'
</script>

<template>
  <BentoSlide title="Dashboard" meta="W42 · 2025">
    <!-- KPI hero con trend -->
    <BentoCard size="2x2" tone="primary" eyebrow="Revenue" title="€ 184K">
      <Sparkline :values="trend" :width="320" :height="120" fill />
      <div style="display:flex; align-items:center; gap:0.5rem;">
        <DeltaBadge :value="12.4" />
        <span class="bento-card__footer">vs. settimana precedente</span>
      </div>
    </BentoCard>

    <!-- Metric tiles -->
    <BentoCard size="1x1" eyebrow="Utenti" title="12.4K" />
    <BentoCard size="1x1" eyebrow="CVR"    title="3.7%" />

    <!-- Lista servizi -->
    <BentoCard size="2x1" tone="muted" eyebrow="Servizi" title="Health">
      <ul style="margin:0; padding:0; list-style:none;
                 display:grid; grid-template-columns:repeat(2,1fr); gap:0.4rem;">
        <li v-for="s in services" :key="s.name"
            style="display:flex; justify-content:space-between; font-size:var(--txt-s);">
          <span>{{ s.name }}</span>
          <StatusBadge :status="s.status" />
        </li>
      </ul>
    </BentoCard>
  </BentoSlide>
</template>
```

---

## Pitfall

- **Overflow**: la slide è 1280×720. Contenuto che sfora viene tagliato (`overflow: hidden`). Usa `Sparkline` con `width/height` espliciti.
- **Span > columns**: la card occupa l'intera riga senza errori.
- **`tone="dark"` con figli custom**: il colore di default è scuro — applica `color: inherit` o usa le classi `bento-card__*`.
- **Slot vuoti**: `eyebrow`/`title` senza body riempiono comunque l'header — utile per metric tile minimal.

---

## Theming

Le card rispettano i token pubblici (`--surface`, `--border`, `--slide-radius`, `--brand-*`, `--text-*`). Per override puntuali:

```css
/* examples/my-deck/theme.css */
.bento-card { box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.bento-card--primary { border-width: 2px; border-color: var(--brand-primary); }
.bento-card--dark    { background: linear-gradient(135deg, #0f172a, #1e293b); }
```

Pattern di layout consigliati:
- **2×2 hero + tre 1×1** — KPI principale grande, secondari piccoli (layout classico "above the fold")
- **2×2 + 2×1 + 3×1 lista** — trend + lista di status su griglia 4×3
- **Mix tone** — `primary` per il KPI hero, `muted` per supporto, `dark` per metrica executive
