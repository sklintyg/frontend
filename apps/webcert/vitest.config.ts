import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    deps: {
      inline: [/common\/dist/],
    },
    setupFiles: ['src/setupTests.ts'],
    silent: process.env.CI === 'true',
    coverage: {
      reporter: ['text', 'json', 'lcov'],
      all: true,
      branches: 80,
      lines: 80,
      functions: 75,
      statements: 80,
    },
  },
})
