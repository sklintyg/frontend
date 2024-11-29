/* eslint-disable import/no-default-export */
import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import type { ProxyOptions, UserConfig } from 'vite'
import { defineConfig, loadEnv } from 'vite'

export default ({ mode }: UserConfig) => {
  Object.assign(process.env, loadEnv(mode ?? 'development', process.cwd()))
  const hmr = process.env.VITE_HMR !== 'false'
  const https = process.env.VITE_HTTPS !== 'false'
  const host = process.env.VITE_HOST ?? 'localhost'
  const hmrProtocol = process.env.VITE_WS_PROTOCOL ?? 'ws'

  const proxy = ['api', 'fake', 'login', 'logout', 'saml2'].reduce<Record<string, string | ProxyOptions>>(
    (result, route) => ({
      ...result,
      [`/${route}`]: {
        secure: false,
        target: process.env.VITE_API_TARGET ?? 'https://mi2-minaintyg-devtest.intyg.nordicmedtest.se',
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
      port: 5174,
      proxy,
      strictPort: true,
      https: https
        ? {
            cert: fs.readFileSync(path.resolve(__dirname, '../../cert/localhost.crt')),
            key: fs.readFileSync(path.resolve(__dirname, '../../cert/localhost.key')),
            passphrase: fs.readFileSync(path.resolve(__dirname, '../../cert/global.pass'), 'utf8').trim(),
          }
        : undefined,
      hmr: hmr ? { host: process.env.VITE_WS_HOST, protocol: hmrProtocol } : false,
    },
  })
}
