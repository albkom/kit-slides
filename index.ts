// Motore
export { default as SlideDeck }   from './src/components/SlideDeck.vue'
export { default as Slide }       from './src/components/Slide.vue'

// UI atoms (usabili nelle slide custom dei consumer)
export { default as KpiCard }     from './src/components/ui/KpiCard.vue'
export { default as DeltaBadge }  from './src/components/ui/DeltaBadge.vue'
export { default as StatusBadge } from './src/components/ui/StatusBadge.vue'

// Tipi pubblici
export type {
  SlideDefinition,
  KpiStato,
  KpiSummary,
  KpiChannel,
  KpiCategory,
  GeoDataPoint,
  WeekRef,
  IAdapter,
  AdapterOptions,
} from './src/types'
