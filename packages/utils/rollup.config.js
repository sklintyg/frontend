/* eslint-disable import/no-default-export */
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import { builtinModules, createRequire } from 'module'
import { defineConfig } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const entries = {
  index: 'src/index.ts',
}

const external = [...builtinModules, ...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})]

const plugins = [
  resolve({
    preferBuiltins: true,
  }),
  json(),
  esbuild({
    target: 'node14',
  }),
]

export default defineConfig([
  {
    input: entries,
    output: {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].js',
      chunkFileNames: 'chunk-[name].js',
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
