/* eslint-disable import/no-default-export */
import { elevenSeventySevenColors } from '@frontend/colors'
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
    colors: {
      black: '#000',
      white: '#FFF',
      ...elevenSeventySevenColors,
    },
  },
  plugins: [],
} satisfies Config
