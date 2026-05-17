# Built-in slides

Le **slide generiche** sono primitive di rendering esposte dal kit. Sono
agnostiche al dominio: accettano dati e una `config` tipizzata, e non sanno
nulla di fatturato, ordini, KPI, ecc. Le slide di dominio sono responsabilità
del consumer (vedi `decks/kpi-report/slides/` per il pattern wrapper).

Tutte le slide:

- vivono in `src/components/slides/`
- sono esportate dall'entry-point `kit-slides` (`import { TableSlide } from 'kit-slides'`)
- hanno props completamente tipizzate (errore in compile-time se mancano)
- mostrano un riquadro `.slide-error` rosso se i dati richiesti mancano a runtime

I tipi di config sono esportati da `kit-slides` (`ColumnDef`, `KpiCardDef`, ecc.).

---

## `CoverSlide`

Slide di apertura: titolo, sottotitolo, badge opzionale, riga di meta in basso.

| Prop      | Tipo     | Required | Note                          |
|-----------|----------|----------|-------------------------------|
| `title`   | `string` | ✔        | Titolo principale             |
| `subtitle`| `string` | —        | Riga sotto il titolo          |
| `badge`   | `string` | —        | Pillola sopra il titolo       |
| `meta`    | `string` | —        | Testo piccolo a fondo slide   |

```ts
import { markRaw } from 'vue'
import { CoverSlide } from 'kit-slides'

export const slides = [
  {
    component: markRaw(CoverSlide),
    props: {
      title: 'Q1 2026 Review',
      subtitle: 'All-hands · marzo 2026',
      badge: 'Internal',
      meta: 'Generato il 17/05/2026',
    },
  },
]
```

---

## `KpiSlide`

Griglia di 4 KPI card (auto-layout). Ogni card mostra label, valore, delta e un mini-doughnut opzionale.

| Prop     | Tipo            | Required | Note                                         |
|----------|-----------------|----------|----------------------------------------------|
| `cards`  | `KpiCardDef[]`  | ✔        | Tipicamente 4 elementi                       |
| `title`  | `string`        | —        | Titolo della slide (header in alto a sinistra) |
| `meta`   | `string`        | —        | Testo a destra dell'header (es. `W21 · 2026`) |

`KpiCardDef`:

```ts
interface KpiCardDef {
  label: string                  // testo sopra il valore
  value: string | number         // valore formattato (es. '€325k')
  delta?: number | null          // percentuale firmata (es. +5.2)
  icon?: string                  // emoji/simbolo opzionale
  pieData?: ChartData<'doughnut'> | null  // mini-grafico opzionale
}
```

```ts
import { KpiSlide } from 'kit-slides'

{
  component: markRaw(KpiSlide),
  props: {
    title: 'Riepilogo KPI',
    meta: 'W21 · 2026',
    cards: [
      { label: 'Fatturato', value: '€325.000', delta: 5.2 },
      { label: 'Ordini',    value: '2.180',    delta: 3.6 },
      { label: 'Conv.',     value: '3,9%',     delta: 2.6 },
      { label: 'AOV',       value: '€149',     delta: -1.6 },
    ],
  },
}
```

---

## `TableSlide`

Tabella tipizzata; le colonne sono descritte da `ColumnDef[]`.

| Prop      | Tipo                          | Required | Note                                |
|-----------|-------------------------------|----------|-------------------------------------|
| `data`    | `Record<string, unknown>[]`   | ✔        | Una riga per record                 |
| `columns` | `ColumnDef[]`                 | ✔        | Definizione e formattazione         |
| `title`   | `string`                      | —        | Header della slide                  |
| `meta`    | `string`                      | —        | Header a destra                     |
| `maxRows` | `number`                      | —        | Tronca a N righe (default: tutte)   |

`ColumnDef`:

```ts
interface ColumnDef {
  key: string              // chiave della riga (es. 'fatturato')
  label: string            // header della colonna
  align?: 'left' | 'center' | 'right'
  width?: string           // CSS width (es. '20%')
  format?: (v, row) => string
  badge?: 'delta' | 'status'   // renderizza come DeltaBadge o StatusBadge
}
```

```ts
import { TableSlide } from 'kit-slides'

{
  component: markRaw(TableSlide),
  props: {
    title: 'Performance per Categoria',
    columns: [
      { key: 'categoria', label: 'Categoria', align: 'left',  width: '40%' },
      { key: 'fatturato', label: 'Fatturato', align: 'right', format: (v) => eur.format(Number(v)) },
      { key: 'delta',     label: 'vs Prec.',  align: 'center', badge: 'delta' },
      { key: 'stato',     label: 'Stato',     align: 'center', badge: 'status' },
    ],
    data: categories,   // [{ categoria: 'Abbigliamento', fatturato: 98000, delta: 3.7, stato: 'in_target' }, ...]
    maxRows: 6,
  },
}
```

---

## `ChartSlide`

Wrapper agnostico su [vue-chartjs](https://vue-chartjs.org/). Accetta direttamente
`data`, `options`, `plugins` di Chart.js senza alcuna trasformazione.

| Prop      | Tipo              | Required | Note                                    |
|-----------|-------------------|----------|-----------------------------------------|
| `data`    | `ChartData<K>`    | ✔        | Dataset Chart.js                        |
| `kind`    | `'bar'\|'line'\|'doughnut'\|'pie'` | — | Default `'bar'`            |
| `options` | `ChartOptions<K>` | —        | Opzioni Chart.js                        |
| `plugins` | `Plugin<K>[]`     | —        | Plugin Chart.js custom                  |
| `title`   | `string`          | —        | Header della slide                      |
| `meta`    | `string`          | —        | Header a destra                         |

```ts
import { ChartSlide } from 'kit-slides'

{
  component: markRaw(ChartSlide),
  props: {
    title: 'Fatturato per Canale',
    kind: 'bar',
    data: {
      labels: ['Organico', 'Paid', 'Email'],
      datasets: [{ data: [118000, 85000, 42000], backgroundColor: '#185fa5' }],
    },
    options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false },
  },
}
```

---

## `MapSlide`

Mappa coropletica del mondo (proiezione Natural Earth, dati `world-atlas`).
Per ogni dato `{ code: 'IT', value: 12345 }` il paese corrispondente viene
colorato; opzionalmente mostra una classifica Top-N a lato.

| Prop              | Tipo                            | Required | Note                                  |
|-------------------|---------------------------------|----------|---------------------------------------|
| `data`            | `GeoDataPoint[]`                | ✔        | `{ code, value }` con alpha-2 ISO     |
| `alpha2ToNumeric` | `Record<string, string\|number>`| (consigliato) | Mapping ISO alpha-2 → numerico  |
| `numericToAlpha2` | `Record<string, string>`        | (consigliato) | Mapping inverso per il tooltip  |
| `countryNames`    | `Record<string, string>`        | —        | Alpha-2 → nome paese                  |
| `topCount`        | `number`                        | —        | Lunghezza classifica (default 5; 0 nasconde la lista) |
| `formatValue`     | `(v: number) => string`         | —        | Format per tooltip                    |
| `formatCompact`   | `(v: number) => string`         | —        | Format compatto per legenda + top-N   |
| `title`           | `string`                        | —        |                                       |
| `meta`            | `string`                        | —        |                                       |

I mapping ISO non sono inclusi nel kit (evitano un peso fisso): vedi
`decks/kpi-report/countryData.ts` per un esempio di tabella.

```ts
import { MapSlide } from 'kit-slides'

{
  component: markRaw(MapSlide),
  props: {
    title: 'Distribuzione geografica',
    data: [{ code: 'IT', value: 120000 }, { code: 'FR', value: 80000 }],
    alpha2ToNumeric, numericToAlpha2, countryNames,
    topCount: 5,
    formatValue:   (v) => eur.format(v),
    formatCompact: (v) => v >= 1000 ? '€' + Math.round(v/1000) + 'K' : '€' + v,
  },
}
```

---

## Quando creare una slide di dominio custom

Se la tua app deve riusare layout/formattazione ricorrenti (es. KPI con label
dominio-specifiche), crea uno **slide wrapper** nel tuo deck che internamente
usa una slide generica. Vedi `decks/kpi-report/slides/Kpi.vue` come riferimento:
accetta `summary: KpiSummary`, costruisce `cards: KpiCardDef[]`, delega a `KpiSlide`.
