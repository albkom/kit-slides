declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

declare const __KIT_DECKS__: string[]
declare const __KIT_CURRENT_DECK__: string
