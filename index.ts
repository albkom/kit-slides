// Motore
export { default as SlideDeck }   from './src/components/SlideDeck.vue'
export { default as Slide }       from './src/components/Slide.vue'

// Slide generiche built-in
export { default as CoverSlide }  from './src/components/slides/CoverSlide.vue'
export { default as KpiSlide }    from './src/components/slides/KpiSlide.vue'
export { default as TableSlide }  from './src/components/slides/TableSlide.vue'
export { default as ChartSlide }  from './src/components/slides/ChartSlide.vue'
export { default as MapSlide }    from './src/components/slides/MapSlide.vue'

// UI atoms (usabili nelle slide custom dei consumer)
export { default as KpiCard }     from './src/components/ui/KpiCard.vue'
export { default as DeltaBadge }  from './src/components/ui/DeltaBadge.vue'
export { default as StatusBadge } from './src/components/ui/StatusBadge.vue'

// Bento — layout componibile a card asimmetriche
export { default as BentoSlide }  from './src/components/bento/BentoSlide.vue'
export { default as BentoCard }   from './src/components/bento/BentoCard.vue'
export type { BentoTone, BentoSize } from './src/components/bento/BentoCard.vue'

// Componenti KPI semantici — livello intermedio tra slide built-in e atomi
export { default as MetricBlock }    from './src/components/kpi/metrics/MetricBlock.vue'
export { default as MetricGroup }    from './src/components/kpi/metrics/MetricGroup.vue'
export { default as RatioBar }       from './src/components/kpi/metrics/RatioBar.vue'
export { default as RankTable }      from './src/components/kpi/comparison/RankTable.vue'
export { default as BarComparison }  from './src/components/kpi/comparison/BarComparison.vue'
export { default as StatusGrid }     from './src/components/kpi/status/StatusGrid.vue'
export { default as ThresholdMeter } from './src/components/kpi/status/ThresholdMeter.vue'
export { default as Sparkline }      from './src/components/kpi/trend/Sparkline.vue'
export { default as WeeklyTrend }    from './src/components/kpi/trend/WeeklyTrend.vue'

// Tipi item dei componenti KPI (per consumer che costruiscono i dati a monte)
export type { MetricItem }   from './src/components/kpi/metrics/MetricGroup.vue'
export type { RankRow }      from './src/components/kpi/comparison/RankTable.vue'
export type { BarItem }      from './src/components/kpi/comparison/BarComparison.vue'
export type { StatusItem }   from './src/components/kpi/status/StatusGrid.vue'
export type { WeeklyPoint }  from './src/components/kpi/trend/WeeklyTrend.vue'

// Tipo pubblico — adapter marker
export type { IAdapter } from './src/composables/types'

// Tipi pubblici — core
export type {
  SlideDefinition,
  KpiStato,
  Status,
  GeoDataPoint,
} from './src/types'

// Tipi pubblici — config slide generiche
export type {
  ColumnDef,
  ColumnAlign,
  KpiCardDef,
  ChartKind,
  TableSlideConfig,
  KpiSlideConfig,
  ChartSlideConfig,
  CoverSlideConfig,
  MapSlideConfig,
} from './src/types'
