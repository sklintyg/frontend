/* eslint-disable import/no-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import { builtinModules, createRequire } from 'module'
import { defineConfig } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
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
  'react/jsx-runtime',
  'type-fest/source/partial-deep',
]
const plugins = [
  resolve({
    preferBuiltins: true,
  }),
  json(),
  svg({ base64: true }),
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
  // {
  //   input: entries,
  //   output: {
  //     dir: 'dist',
  //     entryFileNames: '[name].d.ts',
  //     format: 'esm',
  //   },
  //   external,
  //   plugins: [dts({ respectExternal: true }), svg({ base64: true })],
  //   onwarn,
  // },
])

function onwarn(message) {
  if (['EMPTY_BUNDLE', 'CIRCULAR_DEPENDENCY'].includes(message.code)) return
  // eslint-disable-next-line no-console
  console.error(message)
}
