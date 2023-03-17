/* eslint-disable import/no-default-export */
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    specPattern: 'specs/rehabstod/**/*.{js,jsx,ts,tsx}',
  },
})
