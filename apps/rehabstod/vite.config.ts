/* eslint-disable import/no-default-export */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'rs2.rs.localtest.me',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setupTests.ts'],
    deps: {
      inline: ['@inera/ids-core'],
    },
  },
})
