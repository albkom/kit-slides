import { RestApiAdapter } from './restApiAdapter.js'

export class LocalCSharpAdapter extends RestApiAdapter {
  constructor({ port = 5000 } = {}) {
    super({ baseUrl: `http://localhost:${port}` })
  }
}
