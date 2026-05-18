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

// Composable per il data binding KPI
export { useKpiData }             from './src/composables/useKpiData'
export type { UseKpiDataResult }  from './src/composables/useKpiData'

// Tipi pubblici — adapter & data shape (normalized contract)
export type {
  IAdapter,
  AdapterOptions,
  WeekRef,
  AreaRow,
  ChannelRow,
  PerformanceRow,
  GeoRow,
  DeliveryRow,
  KpiAreaComputed,
  KpiChannel,
  KpiPerformance,
  PerformanceComputed,
  DeliveryComputed,
} from './src/composables/types'

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
