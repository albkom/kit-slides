import { defineConfig, normalizePath } from 'vite'
import vue from '@vitejs/plugin-vue'
import { existsSync } from 'fs'
import { resolve } from 'path'

const deck = process.env.KIT_DECK || 'kpi-report'
const entry = `/decks/${deck}/main.ts`

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

/**
 * Inject the active deck entry into index.html.
 * Also auto-injects `import './theme.css'` at the end of the deck's main.ts
 * (via transform) so it loads after main.scss and can override kit defaults.
 * See AC M.4 — `docs/theming.md`.
 */
function deckEntryPlugin() {
  const themeAbs = normalizePath(resolve(process.cwd(), `decks/${deck}/theme.css`)) 
  const entryAbs = normalizePath(resolve(process.cwd(), `decks/${deck}/main.ts`))
  return {
    name: 'kit-deck-entry',
    enforce: 'pre',
    transform(code, id) {
      // Append theme import after main.scss so it wins the cascade.
      // Strip query params (e.g. ?t=...) before comparing.
      const cleanId = normalizePath(id.split('?')[0])
      if (cleanId === entryAbs && existsSync(themeAbs) && !code.includes("import './theme.css'")) {
        return { code: code + `\nimport './theme.css'`, map: null }
      }
    },
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
