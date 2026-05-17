import { RestApiAdapter } from './restApiAdapter'
import type { AdapterOptions } from '../../../src/types'

export class LocalCSharpAdapter extends RestApiAdapter {
  constructor(options: AdapterOptions = {}) {
    const port = options.port ?? 5000
    super({ baseUrl: `http://localhost:${port}` })
  }
}
