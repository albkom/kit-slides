# KIT Slides — Weekly KPI Report

Applicazione Vue 3 + Vite per la visualizzazione di report settimanali KPI in formato slide 16:9, stampabile in PDF.

## Requisiti

- Node.js 18+
- npm 9+

## Installazione

```bash
cd kit-slides
npm install
```

## Avvio in sviluppo

```bash
npm run dev
```

Apri [http://localhost:5173](http://localhost:5173). Naviga tra le slide con i pulsanti ← → o i tasti freccia della tastiera.

## Aggiornare i dati CSV

I file CSV si trovano in `public/data/`. Il report legge automaticamente la **settimana con il numero più alto** presente nei file.

### `kpi_summary.csv`

Una riga per settimana. Aggiungi una nuova riga in fondo:

```
week,year,fatturato,fatturato_prev,ordini,ordini_prev,tasso_conversione,tasso_conversione_prev,ticket_medio,ticket_medio_prev
21,2026,325000,318750,2180,2104,3.9,3.8,149.08,151.50
```

> I campi `_prev` devono corrispondere ai valori della settimana precedente per calcolare i delta.

### `kpi_by_channel.csv`

Una riga per canale per settimana:

```
week,year,canale,fatturato,ordini,tasso_conversione
21,2026,Organico,118000,870,4.6
21,2026,Paid Search,85000,560,3.2
...
```

### `kpi_by_category.csv`

Una riga per categoria per settimana. Il campo `stato` accetta: `in_target` | `attenzione` | `sotto_target`.

```
week,year,categoria,fatturato,ordini,fatturato_prev,ordini_prev,target_fatturato,stato
21,2026,Abbigliamento,98000,710,94500,692,92000,in_target
...
```

## Generare il PDF

1. Apri l'app nel browser
2. Premi il pulsante **⬇ Scarica PDF** (oppure `Ctrl+P` / `Cmd+P`)
3. Nella finestra di stampa seleziona: **Salva come PDF**, orientamento **Orizzontale**, margini **Nessuno**

Ogni slide viene stampata su una pagina A4 separata.

## Build di produzione

```bash
npm run build
```

I file compilati vengono generati in `dist/`. Prima di aprire `dist/index.html` nel browser, copia i CSV:

```bash
# Windows
xcopy public\data dist\data\ /E /I

# macOS / Linux
cp -r public/data dist/data
```

## Personalizzare il tema

Modifica le variabili in [`src/assets/theme.css`](src/assets/theme.css):

```css
:root {
  --brand-primary: #185FA5;  /* colore principale */
  --brand-accent:  #1D9E75;  /* colore accento / positivo */
  --brand-dark:    #0C447C;  /* sfondo slide cover e header */
}
```

## Aggiungere la mappa geografica

La slide **SlideMap** è un placeholder. Per integrare una mappa reale:

1. Aggiungi `geo_kpi.csv` in `public/data/` con colonne: `week`, `year`, `regione`, `fatturato`, `ordini`
2. Installa Leaflet: `npm install leaflet`
3. Sostituisci il contenuto di `src/components/slides/SlideMap.vue` con il componente mappa

## Struttura del progetto

```
kit-slides/
├── public/
│   └── data/
│       ├── kpi_summary.csv
│       ├── kpi_by_channel.csv
│       └── kpi_by_category.csv
├── src/
│   ├── assets/theme.css          ← CSS variables del tema
│   ├── components/
│   │   ├── SlideDeck.vue         ← contenitore con navigazione
│   │   ├── slides/
│   │   │   ├── SlideCover.vue
│   │   │   ├── SlideKpi.vue
│   │   │   ├── SlideChart.vue
│   │   │   ├── SlideTable.vue
│   │   │   └── SlideMap.vue
│   │   └── ui/
│   │       ├── KpiCard.vue
│   │       ├── DeltaBadge.vue
│   │       └── StatusBadge.vue
│   ├── App.vue
│   └── main.js
├── index.html
├── vite.config.js
└── package.json
```
