import path from 'path'
import type { ViteUserConfig } from 'vitest/config'
import { defineProject } from 'vitest/config'

export default defineProject({
  resolve: {
    alias: {
      '@inera/ids-design': path.resolve(__dirname, './node_modules/@inera/ids-design'),
    },
  },
  test: {
    css: false,
    deps: {
      inline: ['@inera/ids-react'],
    },
    globals: true,
    environment: 'jsdom',
    include: ['./src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    setupFiles: ['src/setupTests.ts'],
    silent: process.env.CI === 'true',
    coverage: {
      reporter: ['text', 'json', 'lcov'],
      thresholds: {
        branches: 80,
        lines: 80,
        functions: 75,
        statements: 80,
      },
    },
  },
} as ViteUserConfig)
