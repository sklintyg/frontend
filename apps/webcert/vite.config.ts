import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { loadEnv, ProxyOptions, UserConfig } from 'vite'
import { defineConfig } from 'vitest/config'

export default ({ mode }: UserConfig) => {
  process.env = { ...process.env, ...loadEnv(mode ?? 'development', process.cwd()) }

  const hmr = !(process.env.VITE_HMR === 'false')
  const host = process.env.VITE_HOST ?? 'localhost'

  const proxy = ['/fake', '/api', '/moduleapi', '/testability', '/visa', '/saml', '/error.jsp', '/logout'].reduce<
    Record<string, string | ProxyOptions>
  >(
    (result, route) => ({
      ...result,
      [route]: {
        secure: false,
        target: process.env.VITE_API_TARGET ?? 'https://wc2.webcert-devtest.intyg.nordicmedtest.se',
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
      port: 3000,
      proxy,
      strictPort: true,
      hmr: hmr
        ? {
            host: process.env.VITE_WS_HOST ?? 'wc2.wc.localtest.me',
            protocol: process.env.VITE_WS_PROTOCOL ?? 'ws',
          }
        : false,
    },
  })
}
