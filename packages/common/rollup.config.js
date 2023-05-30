/* eslint-disable import/no-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { builtinModules, createRequire } from 'module'
import { defineConfig } from 'rollup'
import svg from 'rollup-plugin-svg'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const entries = {
  index: 'src/index.ts',
}

const external = [
  ...builtinModules,
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  'type-fest/source/partial-deep',
]

const plugins = [
  // esbuild({
  //   // target: 'node14',
  //   tsconfig: './tsconfig.json',
  // }),
  svg({ base64: true }),
  typescript({
    exclude: ['**/*.test.ts', '**/*.test.tsx', 'dist'],
    outputToFilesystem: true,
    tsconfig: './tsconfig.json',
  }),
  resolve(),
  commonjs({
    esmExternals: false,
    ignoreGlobal: true,
  }),
]

export default defineConfig([
  {
    input: entries,
    output: {
      dir: 'dist',
      format: 'esm',
      interop: 'auto',
      entryFileNames: '[name].js',
      chunkFileNames: 'chunk-[name].js',
      sourcemap: true,
    },
    external,
    plugins,
    onwarn,
  },
])

function onwarn(message) {
  if (['EMPTY_BUNDLE', 'CIRCULAR_DEPENDENCY'].includes(message.code)) return
  // eslint-disable-next-line no-console
  console.error(message)
}
