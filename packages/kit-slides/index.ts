// Motore
export { default as SlideDeck }   from './src/components/SlideDeck.vue'
export { default as SlideBase }       from './src/components/SlideBase.vue'
export { default as SlideSection }   from './src/components/SlideSection.vue'

// Slide generiche built-in
export { default as CoverSlide }  from './src/components/slides/CoverSlide.vue'
export { default as KpiSlide }    from './src/components/slides/KpiSlide.vue'
export { default as ChartSlide }  from './src/components/slides/ChartSlide.vue'

// UI atoms (usabili nelle slide custom dei consumer)
export { default as KpiCard }     from './src/components/ui/KpiCard.vue'
export { default as DeltaBadge }  from './src/components/ui/DeltaBadge.vue'
export { default as StatusBadge } from './src/components/ui/StatusBadge.vue'
export { default as ProgressBadge } from './src/components/ui/ProgressBadge.vue'
export { default as WidgetBase }         from './src/components/ui/WidgetBase.vue'
export { default as WidgetList }         from './src/components/ui/WidgetList.vue'
export { default as DisplayValueBig }    from './src/components/ui/DisplayValueBig.vue'
export { default as DisplayValueMedium } from './src/components/ui/DisplayValueMedium.vue'
export { default as DisplayValueSmall }  from './src/components/ui/DisplayValueSmall.vue'
export { default as WidgetTable }     from './src/components/ui/WidgetTable.vue'
export { default as WidgetMap }       from './src/components/ui/WidgetMap.vue'
export { default as WidgetPie }       from './src/components/ui/WidgetPie.vue'
export { default as WidgetHistogram } from './src/components/ui/WidgetHistogram.vue'
export { default as WidgetRadar }     from './src/components/ui/WidgetRadar.vue'

// Bento — layout componibile a card asimmetriche
export { default as BentoSlide }  from './src/components/bento/BentoSlide.vue'
export { default as BentoCard }   from './src/components/bento/BentoCard.vue'
export type { BentoTone, BentoSize } from './src/components/bento/BentoCard.vue'

// Componenti KPI semantici — livello intermedio tra slide built-in e atomi
export { default as WidgetMetric }   from './src/components/ui/WidgetMetric.vue'
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
export type { ListItem, ListItemTone }  from './src/components/ui/WidgetList.vue'
export type { DisplayValueBigProps }    from './src/components/ui/DisplayValueBig.vue'
export type { DisplayValueMediumProps } from './src/components/ui/DisplayValueMedium.vue'
export type { DisplayValueSmallProps }  from './src/components/ui/DisplayValueSmall.vue'
export type { PieItem }       from './src/components/ui/WidgetPie.vue'
export type { HistogramItem } from './src/components/ui/WidgetHistogram.vue'
export type { RadarItem }     from './src/components/ui/WidgetRadar.vue'

// Tipo pubblico — adapter marker
export type { IAdapter } from './src/composables/types'

// Utility
export { loadCsv, loadCsvOptional } from './src/utils/csv'

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
