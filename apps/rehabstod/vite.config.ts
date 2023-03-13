/* eslint-disable import/no-default-export */
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import { defineConfig, UserConfig } from 'vitest/config'

export default ({ mode }: UserConfig) => {
  process.env = { ...process.env, ...loadEnv(mode ?? 'development', process.cwd()) }

  return defineConfig({
    plugins: [react(), basicSsl()],
    server: {
      host: 'rs2.rs.localtest.me',
      proxy: {
        '/services': {
          target: 'https://rehabstod-devtest.intyg.nordicmedtest.se',
          cookieDomainRewrite: { '*': '' },
          protocolRewrite: 'https',
          changeOrigin: true,
          autoRewrite: true,
        },
      },
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
