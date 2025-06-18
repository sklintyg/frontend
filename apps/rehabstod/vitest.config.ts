/* eslint-disable import/no-default-export */
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@inera/ids-design': path.resolve(__dirname, './node_modules/@inera/ids-design'),
    },
  },
  test: {
    deps: {
      optimizer: {
        web: {
          enabled: true,
          include: ['@inera/ids-react'],
        },
      },
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setupTests.ts'],
    silent: process.env.CI === 'true',
    coverage: {
      reporter: ['text', 'json', 'lcov'],
      thresholds: {
        branches: 80,
        lines: 80,
        functions: 68,
        statements: 80,
      },
    },
  },
})
