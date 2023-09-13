/* eslint-disable import/no-default-export */
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setupTests.ts'],
    silent: process.env.CI === 'true',
    coverage: {
      reporter: ['text', 'json', 'lcov'],
      branches: 75,
      lines: 75,
      functions: 80,
      statements: 80,
    },
    deps: {
      inline: ['@inera/ids-core', 'handy-scroll'],
    },
  },
})
