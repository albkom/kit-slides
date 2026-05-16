import { CsvAdapter }         from './csvAdapter.js'
import { RestApiAdapter }     from './restApiAdapter.js'
import { LocalCSharpAdapter } from './localCSharpAdapter.js'

export function createAdapter(type, options = {}) {
  switch (type) {
    case 'csv':   return new CsvAdapter(options)
    case 'rest':  return new RestApiAdapter(options)
    case 'local': return new LocalCSharpAdapter(options)
    default:
      throw new Error(`Unknown adapter type: "${type}". Use csv | rest | local`)
  }
}
