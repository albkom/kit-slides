import { markRaw } from 'vue'
import Hello from './slides/Hello.vue'

export function buildSlides() {
  return [
    { component: markRaw(Hello), props: { title: 'La mia presentazione' } },
  ]
}
