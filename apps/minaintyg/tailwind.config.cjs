/** @type {import('tailwindcss').Config} */
module.exports = {
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
      white: '#FFF',
      sky: {
        dark: 'var(--color-sky-dark)',
        base: 'var(--color-sky-base)',
        clear: 'var(--color-sky-clear)',
      },
    },
    extend: {},
  },
  plugins: [],
}
