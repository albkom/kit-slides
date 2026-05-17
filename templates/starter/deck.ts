import { markRaw } from 'vue'
import { CoverSlide } from '../../index'
import Hello from './slides/Hello.vue'
import type { SlideDefinition } from '../../src/types'

export function buildSlides(): SlideDefinition[] {
  return [
    {
      component: markRaw(CoverSlide),
      props: {
        title: 'La mia presentazione',
        subtitle: 'Sottotitolo',
      },
      isCover: true,
    },
    {
      component: markRaw(Hello),
      props: { title: 'Slide custom' },
    },
  ]
}
