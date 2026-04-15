/* eslint-disable import/no-default-export */
import { colors } from './src/colors'
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    preflight: false,
  },
  important: true,
  theme: {
    screens: {
      print: { raw: 'print' },
      sm: '480px',
      md: '800px',
      lg: '940px',
      xl: '1280px',
    },
    colors,
    extend: {},
  },
  plugins: [],
} satisfies Config
