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
      protocolRewrite: 'http',
      changeOrigin: true,
      autoRewrite: true,
    },
  }),
  {}
)

export default defineConfig({
  plugins: [react()],
  server: { proxy, port: 3000 },
  optimizeDeps: {
    include: ['@frontend/common'],
  },
  build: {
    commonjsOptions: {
      include: [/@frontend\/common/, /node_modules/],
    },
  },
})
