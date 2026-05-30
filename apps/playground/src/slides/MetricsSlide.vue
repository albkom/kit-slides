<script setup lang="ts">
import {
  SlideBase, BentoCard, WidgetMetric, KpiCard,
  DeltaBadge, StatusBadge, ProgressBadge, WidgetBase,
} from 'kit-slides'

const metrics = [
  { label: 'Revenue',     value: '€ 1.24M', delta: 4.2,  sub: 'vs prev month'   },
  { label: 'Conversions', value: '8 720',   delta: -1.8, sub: 'leads closed'     },
  { label: 'Avg ticket',  value: '€ 142',   delta: 6.1,  sub: 'per transaction'  },
]

const kpis = [
  { icon: '📦', label: 'Shipments', value: '3 400'  },
  { icon: '✅', label: 'On-time',   value: '94.5%'  },
  { icon: '⚠️', label: 'Incidents', value: '12'     },
]

const areas: Array<{ label: string; status: 'GOOD' | 'ACCEPTABLE' | 'WARNING' | 'BAD'; progress: number }> = [
  { label: 'North', status: 'GOOD',       progress: 0.94 },
  { label: 'South', status: 'ACCEPTABLE', progress: 0.78 },
  { label: 'West',  status: 'WARNING',    progress: 0.54 },
]
</script>

<template>
  <SlideBase
    title="KPI Metrics"
    meta="WidgetMetric · KpiCard · DeltaBadge · StatusBadge · ProgressBadge"
    :columns="3"
  >
    <BentoCard v-for="m in metrics" :key="m.label" size="1x1" :eyebrow="m.label">
      <WidgetMetric :label="m.label" :value="m.value" :subValue="m.sub" :delta="m.delta" />
    </BentoCard>

    <BentoCard size="1x1" eyebrow="KpiCard">
      <div style="display:flex; flex-direction:column; gap:0.4rem;">
        <KpiCard v-for="k in kpis" :key="k.label" :icon="k.icon" :label="k.label" :value="k.value" />
      </div>
    </BentoCard>

    <BentoCard size="1x1" eyebrow="StatusBadge + ProgressBadge">
      <WidgetBase>
        <div
          v-for="a in areas"
          :key="a.label"
          style="display:flex; align-items:center; gap:0.6rem; padding:0.15rem 0;"
        >
          <span style="font-size:var(--txt-xs); color:var(--text-secondary); min-width:3.5rem;">{{ a.label }}</span>
          <ProgressBadge :progress="a.progress" />
          <StatusBadge :stato="a.status" />
        </div>
      </WidgetBase>
    </BentoCard>

    <BentoCard size="1x1" eyebrow="DeltaBadge">
      <WidgetBase>
        <div style="display:flex; flex-wrap:wrap; gap:0.5rem; align-items:center; padding-top:0.25rem;">
          <DeltaBadge :value="12.5" />
          <DeltaBadge :value="-3.2" />
          <DeltaBadge :value="0" />
          <DeltaBadge :value="null" />
        </div>
      </WidgetBase>
    </BentoCard>
  </SlideBase>
</template>
