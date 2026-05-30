# Dati e adapter

Il kit legge i dati tramite un'interfaccia `IKpiAdapter`. L'implementazione di default è `CsvAdapter`.

## CSV (default)

I CSV vivono in `examples/<deck>/public/data/`. Con `VITE_DATA_SOURCE=csv` (default) il `CsvAdapter` li carica al boot e `useKpiData` deriva la settimana corrente.

```
examples/my-deck/
└── public/
    └── data/
        └── items.csv      ← una riga per record, header in prima riga
```

## Configurazione `.env`

Copia `.env.example` in `.env` nella root del deck e decommenta la configurazione desiderata:

```bash
# Sorgente dati: "csv" | "rest" | "local"
VITE_DATA_SOURCE=csv

# Percorso base dei CSV (relativo a public/)
VITE_CSV_PATH=./data

# URL base per l'adapter REST
# VITE_API_BASE=http://localhost:3000

# Porta per l'adapter locale C#
# VITE_LOCAL_PORT=5000
```

## Adapter pattern

```ts
import type { IKpiAdapter } from 'kit-slides'

export class MyAdapter implements IKpiAdapter {
  async load(): Promise<Record<string, unknown>[]> {
    const res = await fetch('/api/kpi')
    return res.json()
  }
}
```

Registra l'adapter nel `main.ts` del deck:

```ts
import { createApp } from 'vue'
import { provideKpiAdapter } from 'kit-slides'
import App from './App.vue'
import { MyAdapter } from './adapters/MyAdapter'

const app = createApp(App)
provideKpiAdapter(app, new MyAdapter())
app.mount('#app')
```

## CsvAdapter — formato colonne atteso

| Colonna    | Tipo     | Note                                          |
|------------|----------|-----------------------------------------------|
| `week`     | `number` | Settimana ISO (es. `21`)                      |
| `year`     | `number` |                                               |
| qualsiasi  | `string\|number` | Tutte le altre colonne passano a `useKpiData` |

`useKpiData` filtra automaticamente sull'ultima settimana disponibile. Per overridare la settimana corrente, passa `{ week }` come opzione:

```ts
const data = useKpiData({ week: 18 })
```
