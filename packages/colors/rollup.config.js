/* eslint-disable import/no-default-export */
import resolve from '@rollup/plugin-node-resolve'
import { builtinModules, createRequire } from 'module'
import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const external = [
  ...builtinModules,
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  'type-fest/source/partial-deep',
]

function onwarn(message) {
  if (['EMPTY_BUNDLE', 'CIRCULAR_DEPENDENCY'].includes(message.code)) return
  // eslint-disable-next-line no-console
  console.error(message)
}

const plugins = [
  esbuild({
    target: 'esnext',
    jsx: 'transform',
    tsconfig: './tsconfig.json',
  }),
  resolve(),
]

export default defineConfig([
  {
    input: {
      index: 'src/index.ts',
    },
    output: [
      {
        dir: 'dist',
        format: 'esm',
        interop: 'auto',
        entryFileNames: '[name].js',
        chunkFileNames: 'chunk-[name].js',
        sourcemap: true,
      },
    ],
    external,
    plugins,
    onwarn,
  },
  {
    input: {
      index: 'src/index.ts',
    },
    output: [
      {
        dir: 'dist',
        format: 'esm',
        entryFileNames: '[name].d.ts',
      },
    ],
    external,
    plugins: [dts({ respectExternal: true })],
    onwarn,
  },
])
