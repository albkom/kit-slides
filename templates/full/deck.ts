import { markRaw } from 'vue'
import { CoverSlide, type SlideDefinition } from 'kit-slides'
import Hello from './slides/Hello.vue'

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
