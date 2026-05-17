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

// Tipi pubblici — core
export type {
  SlideDefinition,
  KpiStato,
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
