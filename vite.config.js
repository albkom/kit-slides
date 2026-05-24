import { defineConfig, normalizePath } from 'vite'
import vue from '@vitejs/plugin-vue'
import { existsSync, readdirSync, readFileSync } from 'fs'
import { resolve, relative } from 'path'

// Discover all decks that have their own main.ts
const decksRoot = resolve('decks')
const allDecks = existsSync(decksRoot)
  ? readdirSync(decksRoot, { withFileTypes: true })
      .filter(d => d.isDirectory() && existsSync(resolve(decksRoot, d.name, 'main.ts')))
      .map(d => d.name)
  : []

const deck    = process.env.KIT_DECK || allDecks[0] || 'starter'
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
 * Also auto-injects each deck's theme.css after main.scss so it wins the cascade.
 * In dev, serves every discovered deck at /<deck-name>/ (MPA routing).
 */
function deckEntryPlugin() {
  return {
    name: 'kit-deck-entry',
    enforce: 'pre',
    transform(code, id) {
      const cleanId = normalizePath(id.split('?')[0])
      // Inject theme.css for whichever deck's main.ts is being transformed
      for (const deckName of allDecks) {
        const dMain = normalizePath(resolve('decks', deckName, 'main.ts'))
        if (cleanId === dMain) {
          const themeAbs = resolve('decks', deckName, 'theme.css')
          const already = code.includes("import './theme.css'") || code.includes("import '__kit_deck__/theme.css'")
          if (existsSync(themeAbs) && !already) {
            return { code: code + `\nimport '${normalizePath(themeAbs)}'`, map: null }
          }
          return
        }
      }
    },
    configureServer(server) {
      // Serve each deck at /<deck-name>/ so the toolbar can link between them
      server.middlewares.use((req, res, next) => {
        const url = req.url || '/'
        const accept = req.headers['accept'] || ''
        const match = url.match(/^\/([^/?#]+)(?:\/(?:index\.html)?)?(?:\?[^#]*)?$/)
        if (match && allDecks.includes(match[1]) && accept.includes('text/html')) {
          const deckName = match[1]
          const entry = '/' + normalizePath(relative(process.cwd(), resolve('decks', deckName, 'main.ts')))
          const template = readFileSync(resolve('index.html'), 'utf-8')
          const html = template.replace('__KIT_ENTRY__', entry)
          server.transformIndexHtml(url, html)
            .then(final => { res.setHeader('Content-Type', 'text/html'); res.end(final) })
            .catch(next)
          return
        }
        next()
      })
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
  define: {
    __KIT_DECKS__: JSON.stringify(allDecks),
    __KIT_CURRENT_DECK__: JSON.stringify(deck),
  },
  resolve: {
    alias: [
      { find: 'kit-slides/styles', replacement: resolve('./packages/kit-slides/src/styles/main.scss') },
      { find: 'kit-slides',        replacement: resolve('./packages/kit-slides/index.ts') },
      { find: '__kit_deck__',      replacement: resolve('decks', deck) },
    ],
  },
  publicDir: existsSync(resolve(deckDir, 'public')) ? `decks/${deck}/public` : undefined,
}))
