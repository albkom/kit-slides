# Using kit-slides in a New Vue Project — First Time

> kit-slides lives in the monorepo and is consumed as a local path, not from npm.

---

## 1. Clone the repo and install dependencies

```bash
git clone https://github.com/<your-org>/kit-slides.git
cd kit-slides
pnpm install
```

## 2. Scaffold your deck

```bash
task new NAME=my-deck
```

Creates `decks/my-deck/` with all required files already configured.

## 3. Start the dev server

```bash
task dev NAME=my-deck
```

Open `http://localhost:5173` — placeholder slides appear in the browser.

## 4. Compose your slides in `deck.ts`

Import built-in slides from `kit-slides` and build the array:

```ts
import { markRaw } from 'vue'
import { CoverSlide, KpiSlide } from 'kit-slides'

export function buildSlides() {
  return [
    { component: markRaw(CoverSlide), props: { title: 'My Report' } },
    { component: markRaw(KpiSlide),   props: { title: 'KPI', cards: [...] } },
  ]
}
```

## 5. Import styles in `main.ts`

```ts
import 'kit-slides/styles'
```

The deck's `theme.css` (if present) is injected automatically by Vite.

## 6. Adjust the theme _(optional)_

In `decks/my-deck/theme.css`, use a built-in theme or override CSS variables:

```css
@import "../../src/styles/themes/corporate.css";
/* deck-specific overrides below */
```

## 7. Export the PDF

```bash
task pdf NAME=my-deck
```

`slides.pdf` is saved in the project root.

---

> **Golden rule:** all deck imports go through `kit-slides` — never from `kit-slides/src/...`.