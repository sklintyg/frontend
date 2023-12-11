/* eslint-disable import/no-default-export */
import { themes } from '@frontend/components/themes'
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './node_modules/@frontend/components/dist/*.js'],
  important: true,
  theme: {
    screens: {
      print: { raw: 'print' },
      sm: '480px',
      md: '800px',
      lg: '940px',
      xl: '1280px',
    },
    colors: {
      main: 'var(--color-main)',
      sky: {
        dark: 'var(--color-sky-dark)',
        base: 'var(--color-sky-base)',
        clear: 'var(--color-sky-clear)',
      },
      stone: {
        dark: 'var(--color-stone-dark)',
        base: 'var(--color-stone-base)',
        clear: 'var(--color-stone-clear)',
        line: 'var(--color-stone-line)',
        background: 'var(--color-stone-background)',
      },
      accent: {
        30: 'var(--IDS-COLOR-ACCENT-30)',
        40: 'var(--IDS-COLOR-ACCENT-40)',
        90: 'var(--IDS-COLOR-ACCENT-90)',
      },
      ...themes.baseTheme,
    },
    extend: {},
  },
  plugins: [],
} satisfies Config
