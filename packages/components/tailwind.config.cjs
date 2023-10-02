/** @type {import('tailwindcss').Config} */
module.exports = {
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
      white: '#FFF',
      'tooltip-color': 'var(--tooltip-color)',
      'tooltip-border-color': 'var(--tooltip-border-color)',
    },
    extend: {},
  },
  plugins: [],
}
