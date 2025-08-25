import legacy from '@vitejs/plugin-legacy'
import path, { resolve } from 'path'
import { defineConfig } from 'vite'

const root = resolve(__dirname, 'src')
const outDir = resolve(__dirname, 'dist')

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  appType: 'mpa',
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
        root: resolve(root, 'index.html'),
        general: resolve(root, 'general/index.html'),
        intyg: resolve(root, 'intyg/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@inera/ids-design': path.resolve(__dirname, './node_modules/@inera/ids-design'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5175,
    allowedHosts: true,
  },
})
