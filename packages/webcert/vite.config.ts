import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { loadEnv, ProxyOptions, UserConfig } from 'vite'
import { defineConfig } from 'vitest/config'

export default ({ mode }: UserConfig) => {
  process.env = { ...process.env, ...loadEnv(mode ?? 'development', process.cwd()) }

  const https = process.env.VITE_HTTPS === 'true'
  const hmr = !(process.env.VITE_HMR === 'false')

  const proxy = ['/fake', '/api', '/moduleapi', '/testability', '/visa', '/saml', '/error.jsp', '/logout'].reduce<
    Record<string, string | ProxyOptions>
  >(
    (result, route) => ({
      ...result,
      [route]: {
        target: process.env.VITE_API_TARGET ?? 'https://wc2.webcert-devtest.intyg.nordicmedtest.se',
        cookieDomainRewrite: { '*': '' },
        protocolRewrite: https ? 'https' : 'http',
        changeOrigin: true,
        autoRewrite: true,
      },
    }),
    {}
  )

  return defineConfig({
    plugins: [react()].concat(https ? [basicSsl()] : []),
    server: {
      proxy,
      https,
      hmr,
      strictPort: true,
      port: 3000,
      host: process.env.VITE_HOST ?? 'localhost',
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
}
