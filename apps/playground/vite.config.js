import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      { find: 'kit-slides/styles', replacement: resolve(__dirname, '../../packages/kit-slides/src/styles/main.scss') },
      { find: 'kit-slides',        replacement: resolve(__dirname, '../../packages/kit-slides/index.ts') },
    ],
  },
})
