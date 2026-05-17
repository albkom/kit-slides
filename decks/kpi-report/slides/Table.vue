<script setup lang="ts">
import { computed } from 'vue'
import { StatusBadge, DeltaBadge } from '../../../index'
import type { KpiCategory } from '../../../src/types'

const props = defineProps<{
  categories: KpiCategory[]
  week: number
  year: number
}>()

const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
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
            <td class="col-delta"><DeltaBadge :value="row.fatturato_delta" /></td>
            <td class="col-stato"><StatusBadge :stato="row.stato" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
