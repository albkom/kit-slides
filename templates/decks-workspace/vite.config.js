import { defineConfig, normalizePath } from 'vite'
import vue from '@vitejs/plugin-vue'
import { existsSync } from 'fs'
import { resolve, relative, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const _require = createRequire(import.meta.url)
const kitSlidesDir = dirname(_require.resolve('kit-slides/package.json'))

const deck    = process.env.KIT_DECK || ''
const deckDir = resolve('decks', deck)
const deckMain = resolve(deckDir, 'main.ts')
const kitMain  = resolve(kitSlidesDir, 'src/kit-main.ts')
const entryFile    = deck && existsSync(deckMain) ? deckMain : kitMain
const entryRelative = '/' + normalizePath(relative(process.cwd(), entryFile))

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
  const themeAbs = normalizePath(resolve(deckDir, 'theme.css'))
  const entryAbs = normalizePath(entryFile)
  return {
    name: 'kit-deck-entry',
    enforce: 'pre',
    transform(code, id) {
      const cleanId = normalizePath(id.split('?')[0])
      const alreadyImported =
        code.includes("import './theme.css'") ||
        code.includes("import '__kit_deck__/theme.css'")
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
    alias: {
      '__kit_deck__': resolve('decks', deck),
    },
  },
  publicDir: deck && existsSync(resolve(deckDir, 'public'))
    ? `decks/${deck}/public`
    : undefined,
}))
