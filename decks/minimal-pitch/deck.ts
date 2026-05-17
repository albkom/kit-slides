import { markRaw } from 'vue'
import Cover from './slides/Cover.vue'
import Quote from './slides/Quote.vue'
import Text  from './slides/Text.vue'
import type { SlideDefinition } from '../../src/types'

export function buildSlides(): SlideDefinition[] {
  return [
    { component: markRaw(Cover), props: {
      title: 'Una buona idea',
      subtitle: 'Pitch deck minimale',
      author: 'Team Propaganza',
    } },
    { component: markRaw(Quote), props: {
      quote: 'Semplicità è la sofisticazione finale.',
      attribution: 'Leonardo da Vinci',
    } },
    { component: markRaw(Text), props: {
      heading: 'Il problema',
      body: 'I deck KPI sono efficaci per i numeri, ma sterili per le storie. Una libreria slide riutilizzabile deve coprire entrambi gli use case con la stessa API.',
    } },
  ]
}
