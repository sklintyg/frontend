import type { Config } from 'tailwindcss'
import { baseTheme } from './src/themes/base'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  important: true,
  theme: {
    screens: {
      print: { raw: 'print' },
      sm: '480px',
      md: '800px',
      lg: '1024px',
      xl: '1280px',
    },
    colors: {
      ...Object.fromEntries(Object.keys(baseTheme).map((key) => [key, `var(--${key})`])),
    },
    extend: {},
  },
  plugins: [],
} satisfies Config
