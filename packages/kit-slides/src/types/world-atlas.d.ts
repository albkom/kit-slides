declare module 'world-atlas/countries-110m.json' {
  import type { Topology, Objects } from 'topojson-specification'
  const data: Topology<Objects<{ [key: string]: unknown }>>
  export default data
}
