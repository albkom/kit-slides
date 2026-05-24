<script setup lang="ts">
import { Bar, Line, Doughnut, Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import type { ChartData, ChartOptions, Plugin } from 'chart.js'
import type { ChartKind } from '../../types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
)

/**
 * `data`/`options`/`plugins` are intentionally typed loosely:
 * Chart.js' types are parameterised by chart kind, but our prop
 * `kind` is itself a string union — we forward the data to the
 * correct vue-chartjs component below and cast at the boundary.
 */
interface Props {
  data: ChartData<ChartKind>
  kind?: ChartKind
  options?: ChartOptions<ChartKind>
  plugins?: Plugin<ChartKind>[]
  title?: string
  meta?: string
}
const props = withDefaults(defineProps<Props>(), {
  kind: 'bar',
  options: undefined,
  plugins: () => [],
  title: '',
  meta: '',
})
</script>

<template>
  <div v-if="!props.data" class="slide slide-error">
    Slide "ChartSlide": prop <code>data</code> mancante.
  </div>
  <div v-else class="slide-body slide-chart">
    <div v-if="title || meta" class="slide-header">
      <h2 v-if="title" class="slide-title">{{ title }}</h2>
    </div>
    <div class="chart-wrapper">
      <Bar
        v-if="kind === 'bar'"
        :data="(data as ChartData<'bar'>)"
        :options="(options as ChartOptions<'bar'> | undefined)"
        :plugins="(plugins as unknown as Plugin<'bar'>[])"
      />
      <Line
        v-else-if="kind === 'line'"
        :data="(data as ChartData<'line'>)"
        :options="(options as ChartOptions<'line'> | undefined)"
        :plugins="(plugins as unknown as Plugin<'line'>[])"
      />
      <Doughnut
        v-else-if="kind === 'doughnut'"
        :data="(data as ChartData<'doughnut'>)"
        :options="(options as ChartOptions<'doughnut'> | undefined)"
        :plugins="(plugins as unknown as Plugin<'doughnut'>[])"
      />
      <Pie
        v-else-if="kind === 'pie'"
        :data="(data as ChartData<'pie'>)"
        :options="(options as ChartOptions<'pie'> | undefined)"
        :plugins="(plugins as unknown as Plugin<'pie'>[])"
      />
    </div>
  </div>
</template>
