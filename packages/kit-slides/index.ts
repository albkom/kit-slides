// Engine
export { default as SlideDeck } from './src/components/SlideDeck.vue'
export type { DeckSlide } from './src/components/SlideDeck.vue'
export type { DeckSlide as SlideDefinition } from './src/components/SlideDeck.vue'

// Slides
export { default as CoverSlide }   from './src/components/CoverSlide.vue'
export { default as SlideBase }    from './src/components/SlideBase.vue'

// Cards
export { default as BentoCard } from './src/components/CardBase.vue'
export { default as CardBase }  from './src/components/CardBase.vue'
export type { CardBaseTone, CardBaseSize } from './src/components/CardBase.vue'

// Atoms
export { default as KpiCard }       from './src/components/ui/KpiCard.vue'
export { default as DeltaBadge }    from './src/components/ui/DeltaBadge.vue'
export { default as StatusBadge }   from './src/components/ui/StatusBadge.vue'
export { default as ProgressBadge } from './src/components/ui/ProgressBadge.vue'

// Display values
export { default as DisplayValueBig }    from './src/components/ui/DisplayValueBig.vue'
export { default as DisplayValueMedium } from './src/components/ui/DisplayValueMedium.vue'
export { default as DisplayValueSmall }  from './src/components/ui/DisplayValueSmall.vue'

// Widget base & layout
export { default as WidgetBase }   from './src/components/ui/WidgetBase.vue'
export { default as WidgetMetric } from './src/components/ui/WidgetMetric.vue'
export { default as WidgetList }   from './src/components/ui/WidgetList.vue'
export type { ListItem }           from './src/components/ui/WidgetList.vue'

// Widget charts & data
export { default as WidgetTable }     from './src/components/ui/WidgetTable.vue'
export { default as WidgetMap }       from './src/components/ui/WidgetMap.vue'
export { default as WidgetPie }       from './src/components/ui/WidgetPie.vue'
export type { PieItem }               from './src/components/ui/WidgetPie.vue'
export { default as WidgetHistogram } from './src/components/ui/WidgetHistogram.vue'
export type { HistogramItem }         from './src/components/ui/WidgetHistogram.vue'
export { default as WidgetRadar }     from './src/components/ui/WidgetRadar.vue'
export type { RadarItem }             from './src/components/ui/WidgetRadar.vue'

// Core types
export type { Status, GeoDataPoint, ColumnDef, ColumnAlign, KpiMonitor, IAdapter } from './src/types'
