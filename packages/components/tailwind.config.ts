/* eslint-disable import/no-default-export */
import type { Config } from 'tailwindcss'
import { elevenSeventySevenColors, elevenSeventySevenProColors, ineraAdminColors, ineraColors } from './src/theme/colors'

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
    colors: {
      ...elevenSeventySevenColors,
      ...elevenSeventySevenProColors,
      ...ineraAdminColors,
      ...ineraColors,
    },
    extend: {
      backgroundImage: {
        'form-invalid_background': 'var(--IDS-FORM-INVALID_BACKGROUND-IMAGE)',
        'form-disabled_background': 'var(--IDS-FORM-DISABLED_BACKGROUND-IMAGE);',
      },
    },
  },
  plugins: [],
} satisfies Config
