/* eslint-disable import/no-default-export */
import resolve from '@rollup/plugin-node-resolve'
import { builtinModules, createRequire } from 'module'
import { defineConfig } from 'rollup'
import del from 'rollup-plugin-delete'
import esbuild from 'rollup-plugin-esbuild'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const entries = {
  index: 'src/index.ts',
}

const external = [...builtinModules, ...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})]

const plugins = [
  del({ targets: 'dist/*' }),
  resolve({
    preferBuiltins: true,
  }),
  esbuild({
    target: 'esnext',
  }),
]

function onwarn(message) {
  if (['EMPTY_BUNDLE', 'CIRCULAR_DEPENDENCY'].includes(message.code)) return
  // eslint-disable-next-line no-console
  console.error(message)
}

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
