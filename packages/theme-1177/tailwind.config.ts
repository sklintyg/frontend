/* eslint-disable import/no-default-export */
import { colors } from '@frontend/colors'
import type { Config } from 'tailwindcss'

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
  },
  plugins: [],
} satisfies Config
