<script setup lang="ts">
import {
  SlideBase, BentoCard,
  WidgetPie, WidgetHistogram, WidgetRadar,
  type PieItem, type HistogramItem, type RadarItem,
} from 'kit-slides'

const pie: PieItem[] = [
  { label: 'Direct',  value: 4500 },
  { label: 'Organic', value: 3100 },
  { label: 'Paid',    value: 1800 },
  { label: 'Partner', value:  920 },
]

const hist: HistogramItem[] = [
  { label: 'Server A', value: 9200 },
  { label: 'Server B', value: 7400 },
  { label: 'Server C', value: 6100 },
  { label: 'Server D', value: 4800 },
  { label: 'Server E', value: 3200 },
]

const radarAxes = ['Speed', 'Accuracy', 'Cost', 'Coverage', 'Reliability']
const radar: RadarItem[] = [
  { label: 'Team A', values: [85, 92, 70, 88, 95] },
  { label: 'Team B', values: [78, 85, 88, 72, 80] },
]
</script>

<template>
  <SlideBase title="Charts" meta="WidgetPie · WidgetHistogram · WidgetRadar">
    <BentoCard size="2x1" eyebrow="Response mix">
      <WidgetPie :data="pie" kind="doughnut" />
    </BentoCard>
    <BentoCard size="2x1" eyebrow="Volume by server">
      <WidgetHistogram :data="hist" />
    </BentoCard>
    <BentoCard size="4x1" eyebrow="Team comparison">
      <WidgetRadar :axes="radarAxes" :data="radar" :showLegend="true" />
    </BentoCard>
  </SlideBase>
</template>
