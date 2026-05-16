<script setup>
import { computed } from 'vue'
import StatusBadge from '../ui/StatusBadge.vue'
import DeltaBadge from '../ui/DeltaBadge.vue'

const props = defineProps({
  categories: { type: Array, required: true },
  week: { type: Number, required: true },
  year: { type: Number, required: true },
})

const eur = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})
const num = new Intl.NumberFormat('it-IT')

const rows = computed(() => props.categories.slice(0, 6))
</script>

<template>
  <div class="slide slide-table">
    <div class="slide-header">
      <h2 class="slide-title">Performance per Categoria</h2>
      <span class="slide-meta">W{{ week }} · {{ year }}</span>
    </div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th class="col-cat">Categoria</th>
            <th class="col-num">Fatturato</th>
            <th class="col-num">Ordini</th>
            <th class="col-delta">vs Prec.</th>
            <th class="col-stato">Stato</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.categoria">
            <td class="col-cat cat-name">{{ row.categoria }}</td>
            <td class="col-num">{{ eur.format(row.fatturato) }}</td>
            <td class="col-num">{{ num.format(row.ordini) }}</td>
            <td class="col-delta">
              <DeltaBadge :value="row.fatturato_delta" />
            </td>
            <td class="col-stato">
              <StatusBadge :stato="row.stato" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.slide-table {
  background: var(--surface);
  display: flex;
  flex-direction: column;
  padding: var(--slide-padding);
  gap: 1.5rem;
}

.slide-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.slide-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--brand-dark);
}

.slide-meta {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.table-wrapper {
  flex: 1;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

thead tr {
  border-bottom: 2px solid var(--brand-primary);
}

th {
  padding: 0.7rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

tbody tr {
  border-bottom: 1px solid var(--border);
  transition: background 0.15s;
}

tbody tr:last-child {
  border-bottom: none;
}

tbody tr:hover {
  background: var(--brand-light);
}

td {
  padding: 0.85rem 1rem;
  vertical-align: middle;
}

.col-cat { width: 35%; }
.col-num { width: 18%; text-align: right; font-variant-numeric: tabular-nums; }
.col-delta { width: 14%; text-align: center; }
.col-stato { width: 15%; text-align: center; }

.cat-name {
  font-weight: 600;
  color: var(--text-primary);
}
</style>
