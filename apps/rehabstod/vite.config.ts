/* eslint-disable import/no-default-export */
import react from '@vitejs/plugin-react'
import fs from 'fs'
import { loadEnv, ProxyOptions } from 'vite'
import { defineConfig, UserConfig } from 'vitest/config'

export default ({ mode }: UserConfig) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode ?? 'development', process.cwd()),
  }

  const localCert =
    fs.existsSync('cert/key.pem') && fs.existsSync('cert/cert.pem')
      ? {
          key: fs.readFileSync('cert/key.pem'),
          cert: fs.readFileSync('cert/cert.pem'),
        }
      : false

  const https = process.env.VITE_HTTPS === 'true' ? localCert : false
  const hmr = !(process.env.VITE_HMR === 'false')
  const host = process.env.VITE_HOST ?? 'localhost'
  const hmrProtocol = process.env.VITE_WS_PROTOCOL ?? https ? 'wss' : 'ws'

  const proxy = ['api', 'services', 'fake', 'error.jsp', 'logout', 'welcome.html', 'saml'].reduce<Record<string, string | ProxyOptions>>(
    (result, route) => ({
      ...result,
      [`/${route}`]: {
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
    plugins: [react()],
    server: {
      host,
      https,
      port: 5173,
      proxy,
      strictPort: true,
      hmr: hmr ? { host, protocol: hmrProtocol } : false,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/setupTests.ts'],
      deps: {
        inline: ['@inera/ids-core'],
      },
    },
  })
}
