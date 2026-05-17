import { CsvAdapter }         from './csvAdapter'
import { RestApiAdapter }     from './restApiAdapter'
import { LocalCSharpAdapter } from './localCSharpAdapter'
import type { IAdapter, AdapterOptions } from '../../../src/types'

export type AdapterType = 'csv' | 'rest' | 'local'

export function createAdapter(type: AdapterType, options: AdapterOptions = {}): IAdapter {
  switch (type) {
    case 'csv':   return new CsvAdapter(options)
    case 'rest':  return new RestApiAdapter(options)
    case 'local': return new LocalCSharpAdapter(options)
    default:
      throw new Error(`Unknown adapter type: "${type}". Use csv | rest | local`)
  }
}
