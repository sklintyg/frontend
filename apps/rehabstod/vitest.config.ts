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
      branches: 80,
      lines: 80,
      functions: 70,
      statements: 80,
    },
  },
})
