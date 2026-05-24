import { defineConfig, normalizePath } from 'vite'
import vue from '@vitejs/plugin-vue'
import { existsSync } from 'fs'
import { resolve, relative } from 'path'

const deck    = process.env.KIT_DECK || 'kpi-report'
const deckDir = resolve('decks', deck)
const deckMain = resolve(deckDir, 'main.ts')
const kitMain  = resolve('src', 'kit-main.ts')
const entryFile    = existsSync(deckMain) ? deckMain : kitMain
const entryRelative = '/' + normalizePath(relative(process.cwd(), entryFile))

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
 * Also auto-injects `import '__kit_deck__/theme.css'` at the end of the
 * entry file (deck's main.ts or kit-main.ts) so it loads after main.scss
 * and can override kit defaults.  See AC M.4 — `docs/theming.md`.
 */
function deckEntryPlugin() {
  const themeAbs = normalizePath(resolve(deckDir, 'theme.css'))
  const entryAbs = normalizePath(entryFile)
  return {
    name: 'kit-deck-entry',
    enforce: 'pre',
    transform(code, id) {
      // Append theme import after main.scss so it wins the cascade.
      // Strip query params (e.g. ?t=...) before comparing.
      const cleanId = normalizePath(id.split('?')[0])
      const alreadyImported = code.includes("import './theme.css'") || code.includes("import '__kit_deck__/theme.css'")
      if (cleanId === entryAbs && existsSync(themeAbs) && !alreadyImported) {
        return { code: code + `\nimport '__kit_deck__/theme.css'`, map: null }
      }
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace('__KIT_ENTRY__', entryRelative)
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
  resolve: {
    alias: [
      { find: 'kit-slides/styles', replacement: resolve('./packages/kit-slides/src/styles/main.scss') },
      { find: 'kit-slides',        replacement: resolve('./packages/kit-slides/index.ts') },
      { find: '__kit_deck__',      replacement: resolve('decks', deck) },
    ],
  },
  publicDir: existsSync(resolve(deckDir, 'public')) ? `decks/${deck}/public` : undefined,
}))
