/**
 * Export all slides to slides.pdf.
 *
 * Standalone:   node scripts/export-pdf.js
 * Via npm:      pnpm pdf
 * Watch mode:   pnpm dev:pdf   (re-exports on every file save)
 */
import puppeteer from 'puppeteer'
import { createServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT  = path.join(ROOT, 'slides.pdf')

/**
 * Navigate to `url` with a headless browser and print all slides to PDF.
 * The page must be running the kit-slides app (dev or preview server).
 */
export async function exportPdf(url) {
  console.log(`[pdf] exporting from ${url} …`)
  const browser = await puppeteer.launch({ headless: true })
  try {
    const page = await browser.newPage()
    await page.emulateMediaType('print')
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30_000 })
    // Wait until the deck is rendered (data loaded from CSV)
    await page.waitForSelector('.deck', { timeout: 15_000 })
    await page.pdf({
      path: OUT,
      width: '1280px',
      height: '720px',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    })
    console.log(`[pdf] ✓ saved → ${OUT}`)
  } finally {
    await browser.close()
  }
}

// ── Standalone mode ───────────────────────────────────────────────────────────
// Only execute when run directly (not when imported by vite.config.js).
const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))

if (isMain) {
  const server = await createServer({
    root: ROOT,
    plugins: [vue()],
    server: { port: 5174, strictPort: false },
    logLevel: 'warn',
  })
  await server.listen()
  const { port } = server.httpServer.address()
  try {
    await exportPdf(`http://localhost:${port}`)
  } finally {
    await server.close()
    process.exit(0)
  }
}
