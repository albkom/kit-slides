<script setup lang="ts">
import { SlideBase, BentoCard, WidgetTable, type ColumnDef } from 'kit-slides'

const columns: ColumnDef[] = [
  { key: 'channel', label: 'Channel'                                     },
  { key: 'total',   label: 'Total',   align: 'right'                     },
  { key: 'oks',     label: 'OK',      align: 'right'                     },
  { key: 'kpi',     label: 'KPI %',   align: 'right'                     },
  { key: 'delta',   label: 'Δ prev',  align: 'right',  badge: 'delta'    },
  { key: 'status',  label: 'Status',  align: 'center', badge: 'status'   },
]

const rows = [
  { channel: 'Direct',  total: 4500, oks: 4230, kpi: '94.0%', delta:   2.1, status: 'GOOD'       },
  { channel: 'Organic', total: 3100, oks: 2728, kpi: '88.0%', delta:  -0.8, status: 'ACCEPTABLE' },
  { channel: 'Paid',    total: 1800, oks: 1440, kpi: '80.0%', delta:   1.5, status: 'ACCEPTABLE' },
  { channel: 'Partner', total:  920, oks:  571, kpi: '62.0%', delta:  -5.2, status: 'WARNING'    },
  { channel: 'Other',   total:  340, oks:  136, kpi: '40.0%', delta: -12.0, status: 'BAD'        },
]
</script>

<template>
  <SlideBase title="Performance by Channel" meta="WidgetTable · ColumnDef · delta & status badges">
    <BentoCard size="4x2" eyebrow="Channel breakdown">
      <WidgetTable :data="rows" :columns="columns" />
    </BentoCard>
  </SlideBase>
</template>
