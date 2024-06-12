import legacy from '@vitejs/plugin-legacy'
import { resolve } from 'path'
import { defineConfig } from 'vite'

const root = resolve(__dirname, 'src')
const outDir = resolve(__dirname, 'dist')

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins:
    process.env.LEGACY_SUPPORT !== 'false'
      ? [
          legacy({
            targets: ['defaults', 'not IE 11'],
          }),
        ]
      : [],
  root,
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        general: resolve(root, 'index.html'),
        intyg: resolve(root, 'intyg', 'index.html'),
      },
    },
  },
  server: {
    port: 5175,
  },
})
