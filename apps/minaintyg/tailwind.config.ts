/* eslint-disable import/no-default-export */
import { elevenSeventySevenColors } from 'components/colors'
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './node_modules/components/dist/*.js'],
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
      black: '#000',
      white: '#FFF',
      ...elevenSeventySevenColors,
    },
    extend: {},
  },
  plugins: [],
} satisfies Config
