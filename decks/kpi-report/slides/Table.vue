<script setup lang="ts">
import { computed } from 'vue'
import { TableSlide } from '../../../index'
import type { ColumnDef, KpiCategory } from '../../../index'

const props = defineProps<{
  categories: KpiCategory[]
  week: number
  year: number
}>()

const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
const num = new Intl.NumberFormat('it-IT')

const columns: ColumnDef[] = [
  { key: 'categoria',       label: 'Categoria',  align: 'left',   width: '35%' },
  { key: 'fatturato',       label: 'Fatturato',  align: 'right',  width: '18%', format: (v) => eur.format(Number(v)) },
  { key: 'ordini',          label: 'Ordini',     align: 'right',  width: '18%', format: (v) => num.format(Number(v)) },
  { key: 'fatturato_delta', label: 'vs Prec.',   align: 'center', width: '14%', badge: 'delta' },
  { key: 'stato',           label: 'Stato',      align: 'center', width: '15%', badge: 'status' },
]

const data = computed(() => props.categories as unknown as Record<string, unknown>[])
const meta = computed(() => `W${props.week} · ${props.year}`)
</script>

<template>
  <TableSlide
    title="Performance per Categoria"
    :meta="meta"
    :columns="columns"
    :data="data"
    :max-rows="6"
  />
</template>
