import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { loadEnv, ProxyOptions, UserConfig } from 'vite'
import { defineConfig } from 'vitest/config'

export default ({ mode }: UserConfig) => {
  process.env = { ...process.env, ...loadEnv(mode ?? 'development', process.cwd()) }

  const https = process.env.VITE_HTTPS === 'true'
  const hmr = !(process.env.VITE_HMR === 'false')
  const host = process.env.VITE_HOST ?? 'localhost'
  const hmrProtocol = process.env.VITE_WS_PROTOCOL ?? https ? 'wss' : 'ws'

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
      host,
      https,
      port: 3000,
      proxy,
      strictPort: true,
      hmr: hmr ? { host, protocol: hmrProtocol } : false,
    },
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
        functions: 80,
        statements: 80,
      },
    },
    build: {
      target: 'es2015',
    },
  })
}
