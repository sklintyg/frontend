import react from '@vitejs/plugin-react'
import path from 'node:path'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'common',
      formats: ['es', 'umd'],
      fileName: (format) => `common.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'styled-components'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'styled-components': 'styled',
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setupTests.ts'],
    coverage: {
      reporter: ['text', 'json', 'lcov'],
      all: true,
    },
  },
})
