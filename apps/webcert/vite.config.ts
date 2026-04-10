import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { createRequire } from 'module'
import path from 'path'
import type { ProxyOptions, UserConfig } from 'vite'
import { defineConfig, loadEnv } from 'vite'

const require = createRequire(import.meta.url)

export default ({ mode }: UserConfig) => {
  process.env = { ...process.env, ...loadEnv(mode ?? 'development', process.cwd()) }

  const hmr = !(process.env.VITE_HMR === 'false')
  const host = process.env.VITE_HOST ?? 'localhost'

  const proxy = [
    '/fake',
    '/api',
    '/moduleapi',
    '/testability',
    '/visa',
    '/v2',
    '/webcert',
    '/saml2',
    '/error.jsp',
    '/logout',
    '/login',
  ].reduce<Record<string, string | ProxyOptions>>(
    (result, route) => ({
      ...result,
      [route]: {
        secure: false,
        target: process.env.VITE_API_TARGET ?? 'https://webcert-devtest.intyg.nordicmedtest.se',
        cookieDomainRewrite: { '*': '' },
        protocolRewrite: 'https',
        changeOrigin: true,
        autoRewrite: true,
      },
    }),
    {}
  )

  return defineConfig({
    resolve: {
      alias: {
        '@inera/ids-design': path.dirname(require.resolve('@inera/ids-design/package.json')),
      },
    },
    plugins: [react()].concat(
      process.env.LEGACY_SUPPORT !== 'false'
        ? legacy({
            targets: ['defaults', 'not IE 11'],
          })
        : []
    ),
    server: {
      host,
      port: 3000,
      proxy,
      strictPort: true,
      allowedHosts: true,
      hmr: hmr
        ? {
            host: process.env.VITE_WS_HOST ?? 'wc.localtest.me',
            protocol: process.env.VITE_WS_PROTOCOL ?? 'ws',
          }
        : false,
    },
  })
}
