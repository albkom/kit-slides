import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const deck = process.env.KIT_DECK || 'kpi-report'
const entry = `/decks/${deck}/main.js`

/**
 * Vite plugin: re-export slides.pdf after every hot-module update.
 * Enabled when running `pnpm dev:pdf` (--mode pdf).
 */
function pdfOnSavePlugin() {
  let timer = null
  return {
    name: 'pdf-on-save',
    apply: 'serve',
    configureServer(server) {
      server.watcher.on('change', () => {
        clearTimeout(timer)
        timer = setTimeout(async () => {
          const addr = server.httpServer?.address()
          const port = typeof addr === 'object' && addr ? addr.port : 5173
          try {
            const { exportPdf } = await import('./scripts/export-pdf.js')
            await exportPdf(`http://localhost:${port}`)
          } catch (err) {
            console.error('[pdf] export failed:', err.message)
          }
        }, 1500)
      })
    },
  }
}

function deckEntryPlugin() {
  return {
    name: 'kit-deck-entry',
    enforce: 'pre',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace('__KIT_ENTRY__', entry)
      },
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    deckEntryPlugin(),
    ...(mode === 'pdf' ? [pdfOnSavePlugin()] : []),
  ],
  base: './',
  publicDir: `decks/${deck}/public`,
}))
