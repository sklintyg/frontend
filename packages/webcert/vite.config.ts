import react from '@vitejs/plugin-react'
import { defineConfig, ProxyOptions } from 'vite'

const proxy = ['/fake', '/api', '/moduleapi', '/testability', '/visa', '/saml', '/error.jsp', '/logout'].reduce<
  Record<string, string | ProxyOptions>
>(
  (result, route) => ({
    ...result,
    [route]: {
      target: 'https://wc2.webcert-devtest.intyg.nordicmedtest.se',
      cookieDomainRewrite: { '*': '' },
      protocolRewrite: 'https',
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
    port: 3000,
    host: 'wc2.wc.localtest.me',
    // strictPort: true,
    // hmr: { clientPort: 443, host: 'wc2.wc.localtest.me', protocol: 'wss' },
  },
  test: {
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
