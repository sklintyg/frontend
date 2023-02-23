import react from '@vitejs/plugin-react'
import { ProxyOptions } from 'vite'
import { defineConfig } from 'vitest/config'

const https = process.env.HTTPS === 'true'
const hmr = !(process.env.HMR_DISABLED === 'true')

const proxy = ['/fake', '/api', '/moduleapi', '/testability', '/visa', '/saml', '/error.jsp', '/logout'].reduce<
  Record<string, string | ProxyOptions>
>(
  (result, route) => ({
    ...result,
    [route]: {
      target: process.env.API_TARGET ?? 'https://wc2.webcert-devtest.intyg.nordicmedtest.se',
      cookieDomainRewrite: { '*': '' },
      protocolRewrite: https ? 'https' : 'http',
      changeOrigin: true,
      autoRewrite: true,
    },
  }),
  {}
)

export default defineConfig({
  plugins: [react()],
  server: {
    proxy,
    https,
    hmr,
    port: 3000,
    host: process.env.HOST ?? 'wc2.wc.localtest.me',
    // strictPort: true,
    // hmr: { clientPort: 443, host: 'wc2.wc.localtest.me', protocol: 'wss' },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    deps: {
      inline: [/common\/dist/],
    },
    setupFiles: ['src/setupTests.ts'],
  },
  optimizeDeps: {
    include: ['@frontend/common'],
  },
  build: {
    commonjsOptions: {
      include: [/@frontend\/common/, /node_modules/],
    },
  },
})
