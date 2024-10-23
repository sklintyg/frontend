/* eslint-disable import/no-default-export */
import { ineraAdminColors } from '@frontend/components/colors'
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
      xxl: '1920px',
    },
    colors: {
      black: '#000',
      white: '#FFF',
      orange: '#D17200',
      ...ineraAdminColors,
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
