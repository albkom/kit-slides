# kit-slides

Vue 3 + Vite toolkit per costruire deck di slide 16:9 stampabili in PDF — pensato per report KPI ricorrenti e pitch tecnici.

## Prerequisiti

- **Node.js 18+**
- **pnpm 9+** — `npm install -g pnpm`
- **task** (go-task) — [installazione](https://taskfile.dev/installation/)

## Installazione

```bash
git clone https://github.com/<your-org>/kit-slides.git
cd kit-slides
pnpm install
```

## Primo deck

```bash
task new NAME=my-deck   # scaffold da templates/starter/
task dev NAME=my-deck   # dev server su http://localhost:5173
```

Aggiungi slide in `examples/my-deck/deck.ts`:

```ts
import { markRaw } from 'vue'
import { CoverSlide, KpiSlide } from 'kit-slides'

export const slides = [
  {
    component: markRaw(CoverSlide),
    props: { title: 'Q2 2026', subtitle: 'All-hands · giugno 2026' },
  },
  {
    component: markRaw(KpiSlide),
    props: {
      title: 'KPI settimana',
      cards: [
        { label: 'Fatturato', value: '€ 325k', delta: 5.2 },
        { label: 'Ordini',    value: '2.180',  delta: 3.6 },
      ],
    },
  },
]
```

Esporta in PDF:

```bash
task pdf NAME=my-deck
```

## Theming

Crea `examples/<deck>/theme.css` e sovrascrivi le CSS variables — viene iniettato automaticamente. → [`docs/theming.md`](docs/theming.md)

## Documentazione

| File | Contenuto |
|------|-----------|
| [`docs/slides.md`](docs/slides.md) | API slide built-in e componenti KPI |
| [`docs/bento.md`](docs/bento.md) | BentoSlide / BentoCard — layout a griglia |
| [`docs/theming.md`](docs/theming.md) | Token CSS pubblici, scala tipografica, esempi tema |
| [`docs/data-adapters.md`](docs/data-adapters.md) | CSV, `.env`, adapter pattern |

## Licenza

MIT — vedi [LICENSE](LICENSE).
