import { resolve } from 'path'
import { defineConfig } from 'vite'

const root = resolve(__dirname, 'src')
const outDir = resolve(__dirname, 'dist')

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  root,
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        intyg: resolve(root, 'intyg/index.html'),
      },
    },
  },
  server: {
    port: 5175,
  },
})
