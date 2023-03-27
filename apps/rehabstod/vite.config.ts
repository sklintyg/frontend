/* eslint-disable import/no-default-export */
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { loadEnv, ProxyOptions } from 'vite'
import { defineConfig, UserConfig } from 'vitest/config'

const proxy = ['api', 'services', 'fake', 'error.jsp', 'logout', 'welcome.html'].reduce<Record<string, string | ProxyOptions>>(
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

export default ({ mode }: UserConfig) => {
  process.env = { ...process.env, ...loadEnv(mode ?? 'development', process.cwd()) }

  return defineConfig({
    plugins: [react(), basicSsl()],
    server: {
      host: '0.0.0.0',
      proxy,
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
