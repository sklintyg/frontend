/* eslint-disable import/no-default-export */
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { builtinModules, createRequire } from 'module'
import { defineConfig } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
import styles from 'rollup-plugin-styles'
import svg from 'rollup-plugin-svg'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const external = [
  ...builtinModules,
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  'type-fest/source/partial-deep',
]

const plugins = [
  styles(),
  svg({ base64: true }),
  esbuild({
    target: 'esnext',
    jsx: 'transform',
    tsconfig: './tsconfig.json',
    banner: "import * as React from 'react'",
  }),
  resolve(),
  commonjs({
    esmExternals: false,
    ignoreGlobal: true,
  }),
]

function onwarn(message) {
  if (['EMPTY_BUNDLE', 'CIRCULAR_DEPENDENCY'].includes(message.code)) return
  // eslint-disable-next-line no-console
  console.error(message)
}

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
])
