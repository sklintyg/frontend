import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
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
})
