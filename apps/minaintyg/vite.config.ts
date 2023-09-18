/* eslint-disable import/no-default-export */
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { loadEnv, ProxyOptions } from 'vite'
import { defineConfig, UserConfig } from 'vitest/config'

export default ({ mode }: UserConfig) => {
  process.env = { ...process.env, ...loadEnv(mode ?? 'development', process.cwd()) }

  const https = process.env.VITE_HTTPS === 'true'
  const hmr = !(process.env.VITE_HMR === 'false')
  const host = process.env.VITE_HOST ?? 'localhost'
  const hmrProtocol = process.env.VITE_WS_PROTOCOL ?? https ? 'wss' : 'ws'

  const proxy = ['api', 'fake'].reduce<Record<string, string | ProxyOptions>>(
    (result, route) => ({
      ...result,
      [`/${route}`]: {
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
        all: true,
        exclude: [
          'coverage/**',
          'dist/**',
          'packages/*/test?(s)/**',
          '**/*.d.ts',
          '**/virtual:*',
          '**/__x00__*',
          '**/\x00*',
          'cypress/**',
          'test?(s)/**',
          'test?(-*).?(c|m)[jt]s?(x)',
          '**/*{.,-}{test,spec}.?(c|m)[jt]s?(x)',
          '**/__tests__/**',
          '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
          '**/vitest.{workspace,projects}.[jt]s?(on)',
          '**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}',
          'public/**',
          '**/*.cjs',
          'vite.config.ts',
          'src/mocks/**',
        ],
      },
    },
  })
}
