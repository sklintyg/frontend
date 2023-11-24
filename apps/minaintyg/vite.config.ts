/* eslint-disable import/no-default-export */
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { loadEnv, ProxyOptions } from 'vite'
import { defineConfig, UserConfig } from 'vitest/config'

export default ({ mode }: UserConfig) => {
  Object.assign(process.env, loadEnv(mode ?? 'development', process.cwd()))
  const https = process.env.VITE_HTTPS === 'true'
  const hmr = !(process.env.VITE_HMR === 'false')
  const host = process.env.VITE_HOST ?? 'localhost'
  const hmrProtocol = process.env.VITE_WS_PROTOCOL ?? https ? 'wss' : 'ws'

  const proxy = ['api', 'fake', 'login', 'logout', 'saml2'].reduce<Record<string, string | ProxyOptions>>(
    (result, route) => ({
      ...result,
      [`/${route}`]: {
        secure: false,
        target: process.env.VITE_API_TARGET ?? 'https://mi2-minaintyg-devtest.intyg.nordicmedtest.se',
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
      port: 5174,
      proxy,
      strictPort: true,
      hmr: hmr ? { host, protocol: hmrProtocol } : false,
    },
  })
}
