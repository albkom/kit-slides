<script setup lang="ts">
import {
  SlideSection,
  BentoCard,
  WidgetPie,
  WidgetHistogram,
  WidgetRadar,
  WidgetBase,
  DisplayValueBig,
  DisplayValueMedium,
} from 'kit-slides'
import { useShowcaseData, formatWithK } from '../composables/useShowcaseData'

const { pieItems, histItems, radarItems, radarAxes } = useShowcaseData()

const totalOps = () => pieItems.value.reduce((s, p) => s + p.value, 0)
</script>

<template>
  <SlideSection :columns="2">
    <BentoCard size="1x1" eyebrow="Response distribution">
      <WidgetPie :data="pieItems" kind="doughnut" :formatValue="formatWithK" />
    </BentoCard>

    <BentoCard size="1x1" eyebrow="Operations by code">
      <WidgetHistogram :data="histItems" :formatValue="(v) => v.toFixed(0)" />
    </BentoCard>

    <BentoCard size="1x1" eyebrow="Volume summary">
      <WidgetBase>
        <DisplayValueBig
          label="Total responses"
          :value="formatWithK(totalOps())"
        />
        <DisplayValueMedium
          v-for="p in pieItems.slice(0, 2)"
          :key="p.label"
          :label="p.label"
          :value="formatWithK(p.value)"
        />
      </WidgetBase>
    </BentoCard>

    <BentoCard size="1x1" eyebrow="KPI radar — area comparison">
      <WidgetRadar
        :axes="radarAxes"
        :data="radarItems"
        :formatValue="(v) => v.toFixed(1) + '%'"
        :showLegend="true"
      />
    </BentoCard>
  </SlideSection>
</template>
