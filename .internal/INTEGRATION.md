# Integrare kit-slides in un'app Vue esistente
> Obiettivo: usare `SlideDeck` per renderizzare slide e esportare PDF.

---

## 1. Aggiungi kit-slides come dipendenza locale

Nel `package.json` della tua app:

```json
{
  "dependencies": {
    "kit-slides": "file:../kit-slides/packages/kit-slides"
  }
}
```

Poi installa:

```bash
pnpm install
```

---

## 2. Configura gli alias in `vite.config.ts`

kit-slides si aspetta che `kit-slides` e `kit-slides/styles` siano risolti
via alias — non funziona come un normale pacchetto npm senza questo step.

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

const kitRoot = resolve(__dirname, '../kit-slides/packages/kit-slides')

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      { find: 'kit-slides/styles', replacement: resolve(kitRoot, 'src/styles/main.scss') },
      { find: 'kit-slides',        replacement: resolve(kitRoot, 'index.ts') },
    ],
  },
})
```

---

## 3. Configura i path in `tsconfig.json`

```json
{
  "compilerOptions": {
    "paths": {
      "kit-slides":        ["../kit-slides/packages/kit-slides/index.ts"],
      "kit-slides/styles": ["../kit-slides/packages/kit-slides/src/styles/main.scss"]
    }
  }
}
```

---

## 4. Importa gli stili in `main.ts`

```ts
// src/main.ts
import { createApp } from 'vue'
import 'kit-slides/styles'   // ← stili base del kit
import App from './App.vue'

createApp(App).mount('#app')
```

---

## 5. Crea il componente `SlideReport.vue`

```vue
<!-- src/components/SlideReport.vue -->
<script setup lang="ts">
import { markRaw } from 'vue'
import { SlideDeck, CoverSlide, TableSlide } from 'kit-slides'
import type { SlideDefinition } from 'kit-slides'

const slides: SlideDefinition[] = [
  {
    component: markRaw(CoverSlide),
    isCover: true,
    props: {
      title: 'Q2 2026 Report',
      subtitle: 'Riepilogo vendite',
      meta: 'Generato il 24/05/2026',
    },
  },
  {
    component: markRaw(TableSlide),
    props: {
      title: 'Vendite per canale',
      columns: [
        { key: 'channel', label: 'Canale' },
        { key: 'revenue', label: 'Fatturato', align: 'right' },
        { key: 'delta',   label: 'Δ%',        align: 'right' },
      ],
      rows: [
        { channel: 'Organico', revenue: '€ 84.200', delta: '+5.2%' },
        { channel: 'Paid',     revenue: '€ 61.800', delta: '+3.1%' },
        { channel: 'Direct',   revenue: '€ 38.400', delta: '-1.4%' },
      ],
    },
  },
]
</script>

<template>
  <SlideDeck :slides="slides" />
</template>
```

---

## 6. Usa il componente nell'app

```vue
<!-- src/App.vue -->
<script setup lang="ts">
import SlideReport from './components/SlideReport.vue'
</script>

<template>
  <main>
    <h1>La mia app</h1>

    <!-- il deck si renderizza qui, pronto per il PDF -->
    <SlideReport />
  </main>
</template>
```

---

## 7. Esporta il PDF

Il PDF si genera via Puppeteer, lo stesso script di kit-slides.
Copialo nella tua app da `kit-slides/scripts/export-pdf.js` e aggiungilo
agli script in `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "pdf": "node scripts/export-pdf.js"
  }
}
```

Avvia il dev server, poi in un altro terminale:

```bash
pnpm dev          # app in ascolto su localhost:5173
pnpm pdf          # genera slides.pdf nella root
```

---

## Struttura finale

```
my-vue-app/
├── src/
│   ├── components/
│   │   └── SlideReport.vue   ← il deck
│   ├── main.ts
│   └── App.vue
├── scripts/
│   └── export-pdf.js         ← copiato da kit-slides
├── vite.config.ts            ← alias kit-slides
├── tsconfig.json             ← paths kit-slides
└── package.json
```

---

> **Nota:** `SlideDeck` renderizza le slide in un canvas 16:9 scalato (1280×720 px).
> Posizionalo in una sezione dedicata dell'app, non inline con altri elementi UI.
