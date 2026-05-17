<script setup lang="ts">
import { computed } from 'vue'
import { TableSlide } from '../../../index'
import type { ColumnDef } from '../../../index'
import { DeliveryComputed } from '../types';

const props = defineProps<{
  delivery: DeliveryComputed[]
  week: number
  year: number
}>()

const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
const num = new Intl.NumberFormat('it-IT')

const columns: ColumnDef[] = [
  { key: 'area',             label: 'Area',       align: 'left',   width: '35%' },
  { key: 'delivery_time',    label: 'Delivery',   align: 'right',  width: '18%', format: (v) => num.format(Number(v)) },
  { key: 'on_time_percentage', label: 'On Time', align: 'right',  width: '18%', format: (v) => num.format(Number(v)) },
]

const data = computed(() => props.delivery as unknown as Record<string, unknown>[])
const meta = computed(() => `W${props.week} · ${props.year}`)
</script>

<template>
  <TableSlide
    title="Performance per Area"
    :meta="meta"
    :columns="columns"
    :data="data"
    :max-rows="6"
  />
</template>
