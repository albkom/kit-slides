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

## Componenti KPI

I **componenti KPI** sono primitive di livello intermedio: stanno tra le slide
built-in (un'intera pagina) e gli atomi `ui/` (singolo badge). Sono pensati
per essere usati nelle slide custom quando una slide built-in non basta ma
non vuoi ricostruire un layout da zero.

- vivono in `src/components/kpi/` (sottocartelle: `metrics/`, `comparison/`,
  `status/`, `trend/`)
- sono esportati dall'entry-point `kit-slides`
- hanno props completamente tipizzate; i tipi item (`MetricItem`, `RankRow`,
  `BarItem`, `StatusItem`, `WeeklyPoint`) sono anch'essi esportati
- sono utilizzabili standalone, anche fuori da una slide

### `MetricBlock`

Valore grande + label + delta opzionale.

| Prop        | Tipo                              | Required | Note                          |
|-------------|-----------------------------------|----------|-------------------------------|
| `label`     | `string`                          | ✔        |                               |
| `value`     | `string \| number`                | ✔        | Già formattato                |
| `subValue`  | `string \| number`                | —        | Riga più piccola sotto        |
| `delta`     | `number \| null`                  | —        | Percentuale firmata           |
| `deltaUnit` | `string`                          | —        | Default `'%'`                 |
| `align`     | `'left' \| 'center' \| 'right'`   | —        | Default `'left'`              |

```ts
import { MetricBlock } from 'kit-slides'

<MetricBlock label="Fatturato" value="€325k" :delta="5.2" />
```

### `MetricGroup`

Griglia di `MetricBlock`. Sostituisce la grid di card nelle slide custom.
Accetta `items[]` per il rendering automatico oppure uno slot per inserire
componenti più ricchi (es. `KpiCard`).

| Prop      | Tipo                              | Required | Note                                          |
|-----------|-----------------------------------|----------|-----------------------------------------------|
| `items`   | `MetricItem[]`                    | ✔        | Vuoto + slot ammesso                          |
| `columns` | `number`                          | —        | Forza il numero di colonne (default auto-fit) |
| `align`   | `'left' \| 'center' \| 'right'`   | —        | Propagato a ogni `MetricBlock`                |

```ts
import { MetricGroup, type MetricItem } from 'kit-slides'

const items: MetricItem[] = [
  { label: 'Fatturato', value: '€325k', delta: 5.2 },
  { label: 'Ordini',    value: '2.180', delta: 3.6 },
]

<MetricGroup :items="items" :columns="2" />
```

### `RatioBar`

Due valori contrapposti con barra proporzionale.

| Prop          | Tipo                       | Required | Note               |
|---------------|----------------------------|----------|--------------------|
| `leftLabel`   | `string`                   | ✔        |                    |
| `rightLabel`  | `string`                   | ✔        |                    |
| `leftValue`   | `number`                   | ✔        |                    |
| `rightValue`  | `number`                   | ✔        |                    |
| `formatValue` | `(v: number) => string`    | —        | Default `String()` |

```ts
import { RatioBar } from 'kit-slides'

<RatioBar
  left-label="Vinte"  :left-value="180"
  right-label="Perse" :right-value="32"
  :format-value="(v) => v + ' ops'"
/>
```

### `RankTable`

Lista ordinata con valore + delta per riga.

| Prop          | Tipo                       | Required | Note                       |
|---------------|----------------------------|----------|----------------------------|
| `rows`        | `RankRow[]`                | ✔        |                            |
| `title`       | `string`                   | —        |                            |
| `maxRows`     | `number`                   | —        | `0` = tutte (default)      |
| `formatValue` | `(v: number) => string`    | —        |                            |
| `showRank`    | `boolean`                  | —        | Default `true`             |

```ts
import { RankTable, type RankRow } from 'kit-slides'

const rows: RankRow[] = [
  { label: 'Italia',  value: 120000, delta: 4.2 },
  { label: 'Francia', value:  80000, delta: -1.1 },
]

<RankTable :rows="rows" title="Top paesi" :max-rows="5" />
```

### `BarComparison`

Barre orizzontali per confronto diretto.

| Prop          | Tipo                       | Required | Note                                  |
|---------------|----------------------------|----------|---------------------------------------|
| `items`       | `BarItem[]`                | ✔        | `{ label, value, color? }`            |
| `max`         | `number`                   | —        | Forza il fondo scala (default = max valori) |
| `formatValue` | `(v: number) => string`    | —        |                                       |

```ts
import { BarComparison } from 'kit-slides'

<BarComparison :items="[
  { label: 'Organico', value: 118000 },
  { label: 'Paid',     value:  85000 },
  { label: 'Email',    value:  42000 },
]" />
```

### `StatusGrid`

Griglia di entità con indicatore di stato (`GOOD | ACCEPTABLE | WARNING | BAD`).

| Prop      | Tipo            | Required | Note                                  |
|-----------|-----------------|----------|---------------------------------------|
| `items`   | `StatusItem[]`  | ✔        | `{ label, status, sub? }`             |
| `columns` | `number`        | —        | Default auto-fit                      |

```ts
import { StatusGrid } from 'kit-slides'

<StatusGrid :items="[
  { label: 'auth-svc',    status: 'GOOD' },
  { label: 'billing-svc', status: 'WARNING', sub: 'p99 +12%' },
]" />
```

### `ThresholdMeter`

Valore singolo posizionato su una barra a 3 zone (bad / warn / good).

| Prop          | Tipo                       | Required | Note                                  |
|---------------|----------------------------|----------|---------------------------------------|
| `value`       | `number`                   | ✔        |                                       |
| `min`         | `number`                   | —        | Default `0`                           |
| `max`         | `number`                   | ✔        |                                       |
| `warnAt`      | `number`                   | ✔        | Sotto = `WARNING`                     |
| `badAt`       | `number`                   | ✔        | Sotto = `BAD`                         |
| `label`       | `string`                   | —        |                                       |
| `formatValue` | `(v: number) => string`    | —        |                                       |

```ts
import { ThresholdMeter } from 'kit-slides'

<ThresholdMeter label="SLA mensile" :value="98.4"
  :min="90" :max="100" :bad-at="95" :warn-at="98"
  :format-value="(v) => v + '%'"
/>
```

### `Sparkline`

Mini grafico lineare inline (SVG).

| Prop     | Tipo        | Required | Note                              |
|----------|-------------|----------|-----------------------------------|
| `values` | `number[]`  | ✔        | Minimo 2 punti                    |
| `width`  | `number`    | —        | Default `120`                     |
| `height` | `number`    | —        | Default `32`                      |
| `stroke` | `string`    | —        | CSS color, default brand primary  |
| `fill`   | `boolean`   | —        | Riempi sotto la curva             |

```ts
import { Sparkline } from 'kit-slides'

<Sparkline :values="[12, 15, 14, 18, 22, 20, 24]" fill />
```

### `WeeklyTrend`

Serie settimanale a barre con highlight della settimana corrente.

| Prop          | Tipo                       | Required | Note                       |
|---------------|----------------------------|----------|----------------------------|
| `points`      | `WeeklyPoint[]`            | ✔        | `{ week, value }`          |
| `currentWeek` | `number`                   | ✔        | Settimana evidenziata      |
| `label`       | `string`                   | —        |                            |
| `formatValue` | `(v: number) => string`    | —        |                            |

```ts
import { WeeklyTrend, type WeeklyPoint } from 'kit-slides'

const points: WeeklyPoint[] = [
  { week: 18, value: 110 },
  { week: 19, value: 124 },
  { week: 20, value: 118 },
  { week: 21, value: 132 },
]

<WeeklyTrend :points="points" :current-week="21" label="Operazioni" />
```

---

## Quando creare una slide custom — i tre livelli del kit

Kit-slides offre tre livelli di componenti, in ordine di granularità decrescente.
La regola operativa è **partire dall'alto** e scendere solo se il livello sopra
non basta.

**1 — Slide built-in (`src/components/slides/`).**
Usa una slide built-in (`KpiSlide`, `TableSlide`, `ChartSlide`, ecc.) se il
layout standard più una `config` tipizzata coprono il caso d'uso. È il livello
più astratto: una sola prop strutturata e la slide è pronta.

**2 — Componenti KPI (`src/components/kpi/`).**
Se hai bisogno di un layout che non c'è tra le built-in (es. due metric block
sopra un sparkline accanto a uno status grid), crea una slide custom nel tuo
deck che compone componenti `kpi/`. Esempio:

```vue
<script setup lang="ts">
import { Slide, MetricGroup, Sparkline, type MetricItem } from 'kit-slides'

const metrics: MetricItem[] = [/* … */]
const trend: number[] = [/* … */]
</script>

<template>
  <Slide title="Riepilogo">
    <MetricGroup :items="metrics" :columns="3" />
    <Sparkline :values="trend" :width="320" :height="80" fill />
  </Slide>
</template>
```

**3 — Atomi `ui/` (`src/components/ui/`).**
Solo se ti serve un controllo a granularità di singola pillola (`DeltaBadge`,
`StatusBadge`, `KpiCard`). Tipicamente usato dentro tabelle o griglie custom.

Il deck `decks/kpi-report/slides/Kpi.vue` è un esempio di livello 2 (slide
wrapper che riceve dati di dominio e li traduce in props per una slide
built-in). Il livello 3 lo trovi dentro le celle di `TableSlide` quando una
colonna è marcata con `badge: 'delta' | 'status' | 'progress'`.
