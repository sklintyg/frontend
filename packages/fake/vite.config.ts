/* eslint-disable import/no-default-export */
import path from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'fake',
      formats: ['es', 'umd'],
      fileName: (format) => `fake.${format}.js`,
    },
  },
})
