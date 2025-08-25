/* eslint-disable import/no-default-export */
import type { Config } from 'tailwindcss'

const colors = {
  primary: {
    '30': 'var(--IDS-COLOR-PRIMARY-30)',
    '35': 'var(--IDS-COLOR-PRIMARY-35)',
    '40': 'var(--IDS-COLOR-PRIMARY-40)',
    '90': 'var(--IDS-COLOR-PRIMARY-90)',
  },
  accent: {
    '30': 'var(--IDS-COLOR-ACCENT-30)',
    '40': 'var(--IDS-COLOR-ACCENT-40)',
    '90': 'var(--IDS-COLOR-ACCENT-90)',
    '95': 'var(--IDS-COLOR-ACCENT-95)',
  },
  secondary: {
    '95': 'var(--IDS-COLOR-SECONDARY-95)',
  },
  success: {
    '30': 'var(--IDS-COLOR-SUCCESS-30)',
    '40': 'var(--IDS-COLOR-SUCCESS-40)',
    '99': 'var(--IDS-COLOR-SUCCESS-99)',
  },
  attention: {
    '40': 'var(--IDS-COLOR-ATTENTION-40)',
    '95': 'var(--IDS-COLOR-ATTENTION-95)',
  },
  neutral: {
    '20': 'var(--IDS-COLOR-NEUTRAL-20)',
    '40': 'var(--IDS-COLOR-NEUTRAL-40)',
    '50': 'var(--IDS-COLOR-NEUTRAL-50)',
    '90': 'var(--IDS-COLOR-NEUTRAL-90)',
    '99': 'var(--IDS-COLOR-NEUTRAL-99)',
    '100': 'var(--IDS-COLOR-NEUTRAL-100)',
  },
  error: {
    '40': 'var(--IDS-COLOR-ERROR-40)',
    '99': 'var(--IDS-COLOR-ERROR-99)',
  },
  background: {
    '40': 'var(--IDS-COLOR-BACKGROUND-40)',
  },
} as const

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
      xxl: '1920px',
    },
    colors: {
      black: '#000',
      white: '#FFF',
      ...colors,
    },
    extend: {
      gridTemplateColumns: {
        'table-filter': 'repeat(auto-fit, minmax(280px, 1fr))',
        'table-filter-sm': 'repeat(auto-fit, minmax(300px, 1fr))',
      },
      backgroundImage: {
        'form-invalid_background': 'var(--IDS-FORM-INVALID_BACKGROUND-IMAGE)',
        'form-disabled_background': 'var(--IDS-FORM-DISABLED_BACKGROUND-IMAGE);',
      },
    },
  },
  plugins: [],
} satisfies Config
