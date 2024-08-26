/* eslint-disable import/no-default-export */
import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import type { ProxyOptions } from 'vite'
import { loadEnv } from 'vite'
import type { UserConfig } from 'vitest/config'
import { defineConfig } from 'vitest/config'

export default ({ mode }: UserConfig) => {
  process.env = { ...process.env, ...loadEnv(mode ?? 'development', process.cwd()) }

  const hmr = !(process.env.VITE_HMR === 'false')
  const host = process.env.VITE_HOST ?? 'localhost'
  const hmrProtocol = process.env.VITE_WS_PROTOCOL ?? 'ws'

  const proxy = ['api', 'services', 'fake', 'error.jsp', 'logout', 'welcome.html', 'saml'].reduce<Record<string, string | ProxyOptions>>(
    (result, route) => ({
      ...result,
      [`/${route}`]: {
        secure: false,
        target: process.env.VITE_API_TARGET ?? 'https://rehabstod-devtest.intyg.nordicmedtest.se',
        cookieDomainRewrite: { '*': '' },
        protocolRewrite: 'https',
        changeOrigin: true,
        autoRewrite: true,
      },
    }),
    {}
  )

  return defineConfig({
    plugins: [react()].concat(
      process.env.LEGACY_SUPPORT !== 'false'
        ? legacy({
            targets: ['defaults', 'not IE 11'],
          })
        : []
    ),
    server: {
      host,
      port: 5173,
      proxy,
      strictPort: true,
      hmr: hmr ? { host: process.env.VITE_WS_HOST ?? 'rs2.rs.localtest.me', protocol: hmrProtocol } : false,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/setupTests.ts'],
      silent: process.env.CI === 'true',
      deps: {
        inline: ['@inera/ids-core', 'handy-scroll'],
      },
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
}
