// Motore
export { default as SlideDeck } from './src/components/SlideDeck.vue'
export type { DeckSlide } from './src/components/SlideDeck.vue'

// Slide
export { default as SlideBase } from './src/components/SlideBase.vue'

// Card
export { default as CardBase } from './src/components/CardBase.vue'
export type { CardBaseTone, CardBaseSize } from './src/components/CardBase.vue'

// Atomi
export { default as KpiCard }        from './src/components/ui/KpiCard.vue'
export { default as DeltaBadge }     from './src/components/ui/DeltaBadge.vue'
export { default as StatusBadge }    from './src/components/ui/StatusBadge.vue'
export { default as ProgressBadge }  from './src/components/ui/ProgressBadge.vue'

// Widget
export { default as WidgetTable }     from './src/components/ui/WidgetTable.vue'
export { default as WidgetMap }       from './src/components/ui/WidgetMap.vue'
export { default as WidgetPie }       from './src/components/ui/WidgetPie.vue'
export { default as WidgetHistogram } from './src/components/ui/WidgetHistogram.vue'
export type { PieItem }       from './src/components/ui/WidgetPie.vue'
export type { HistogramItem } from './src/components/ui/WidgetHistogram.vue'

// Tipi core (solo quelli usati dai componenti sopra)
export type { Status } from './src/types'
