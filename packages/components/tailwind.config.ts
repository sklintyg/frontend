/* eslint-disable import/no-default-export */
import type { Config } from 'tailwindcss'
import { baseTheme } from './src/themes/base'

const colors = Object.fromEntries(Object.keys(baseTheme).map((key) => [key, `var(--${key})`]))

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      print: { raw: 'print' },
      sm: '480px',
      md: '800px',
      lg: '1024px',
      xl: '1280px',
    },
    colors,
    extend: {},
  },
  plugins: [],
} satisfies Config
