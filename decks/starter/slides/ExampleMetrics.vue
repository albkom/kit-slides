<script setup lang="ts">
import { computed } from 'vue'
import {
  SlideSection,
  BentoCard,
  WidgetMetric,
  WidgetBase,
  KpiCard,
  DeltaBadge,
  StatusBadge,
  ProgressBadge,
  DisplayValueSmall,
} from 'kit-slides'
import { areas } from '../composables/useDashboardStore'

const firstAreas = computed(() => (areas.value ?? []).slice(0, 3))

const totalOps = computed(() =>
  (areas.value ?? []).reduce((s, a) => s + a.ops, 0),
)

const avgKpi1 = computed(() => {
  const arr = areas.value ?? []
  return arr.length ? arr.reduce((s, a) => s + a.kpi_1, 0) / arr.length : 0
})

function toStatus(v: number): 'GOOD' | 'ACCEPTABLE' | 'WARNING' | 'BAD' {
  if (v >= 0.9) return 'GOOD'
  if (v >= 0.75) return 'ACCEPTABLE'
  if (v >= 0.5) return 'WARNING'
  return 'BAD'
}
</script>

<template>
  <SlideSection :columns="3">
    <!-- Row 1: one WidgetMetric per area -->
    <BentoCard
      v-for="a in firstAreas"
      :key="a.area"
      size="1x1"
      :eyebrow="`Area ${a.area}`"
    >
      <WidgetMetric
        label="KPI 1"
        :value="`${(a.kpi_1 * 100).toFixed(1)}%`"
        :subValue="`${a.ops.toLocaleString()} ops`"
        :delta="a.kpi_1_delta"
      />
    </BentoCard>

    <!-- Row 2: KpiCard | snapshot with badges | progress bars -->
    <BentoCard size="1x1" eyebrow="Overall">
      <KpiCard
        icon="📊"
        label="Total ops"
        :value="totalOps.toLocaleString()"
      />
    </BentoCard>

    <BentoCard size="1x1" eyebrow="KPI snapshot">
      <WidgetBase>
        <DisplayValueSmall
          label="Avg KPI 1"
          :value="`${(avgKpi1 * 100).toFixed(1)}%`"
          :delta="firstAreas[0]?.kpi_1_delta ?? null"
        />
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:0.35rem;">
          <StatusBadge :stato="toStatus(avgKpi1)" />
          <DeltaBadge :value="firstAreas[0]?.kpi_1_delta ?? null" />
        </div>
      </WidgetBase>
    </BentoCard>

    <BentoCard size="1x1" eyebrow="Area progress">
      <WidgetBase>
        <div
          v-for="a in firstAreas"
          :key="a.area"
          style="display:flex; align-items:center; gap:0.6rem; padding:0.15rem 0;"
        >
          <span style="font-size:var(--txt-xs); color:var(--text-secondary); min-width:3rem;">
            Area {{ a.area }}
          </span>
          <ProgressBadge :progress="a.kpi_1" />
          <span style="font-size:var(--txt-xs);">{{ (a.kpi_1 * 100).toFixed(0) }}%</span>
        </div>
      </WidgetBase>
    </BentoCard>
  </SlideSection>
</template>
