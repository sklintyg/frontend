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
      lg: '1024px',
      xl: '1280px',
    },
    colors: {
      primary: {
        30: 'var(--IDS-COLOR-PRIMARY-30)',
        40: 'var(--IDS-COLOR-PRIMARY-40)',
        50: 'var(--IDS-COLOR-PRIMARY-50)',
      },
      secondary: {
        40: 'var(--IDS-COLOR-SECONDARY-40)',
        90: 'var(--IDS-COLOR-SECONDARY-90)',
        95: 'var(--IDS-COLOR-SECONDARY-95)',
      },
      accent: {
        30: 'var(--IDS-COLOR-ACCENT-30)',
        40: 'var(--IDS-COLOR-ACCENT-40)',
        90: 'var(--IDS-COLOR-ACCENT-90)',
      },
      graphic: 'var(--IDS-COLOR-GRAPHIC)',
      alternative: 'var(--IDS-COLOR-ALTERNATIVE)',
      neutral: {
        20: 'var(--IDS-COLOR-NEUTRAL-20)',
        40: 'var(--IDS-COLOR-NEUTRAL-40)',
        90: 'var(--IDS-COLOR-NEUTRAL-90)',
        99: 'var(--IDS-COLOR-NEUTRAL-99)',
      },
      background: 'var(--IDS-COLOR-BACKGROUND)',
      success: {
        40: 'var(--IDS-COLOR-SUCCESS-40)',
        99: 'var(--IDS-COLOR-SUCCESS-99)',
      },
      attention: {
        40: 'var(--IDS-COLOR-ATTENTION-40)',
        95: 'var(--IDS-COLOR-ATTENTION-95)',
      },
      error: {
        40: 'var(--IDS-COLOR-ERROR-40)',
        99: 'var(--IDS-COLOR-ERROR-99)',
        10: '#FF9517',
      },
      ...themes.ineraAdminTheme,
    },
    extend: {
      gridTemplateColumns: {
        'table-filter': 'repeat(auto-fit, minmax(280px, 1fr))',
        'table-filter-sm': 'repeat(auto-fit, minmax(300px, 1fr))',
      },
    },
  },
  plugins: [],
} satisfies Config
