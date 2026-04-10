/* eslint-disable import/no-default-export */
import type { Config } from 'tailwindcss'

export default {
  content: [
    './**/index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@frontend/components/dist/*.js',
    './node_modules/@frontend/theme-1177/dist/*.js',
  ],
  important: true,
  theme: {
    screens: {
      print: { raw: 'print' },
      sm: '480px',
      md: '800px',
      lg: '940px',
      xl: '1280px',
    },
    extend: {
      colors: {
        ids: {
          input: {
            background: 'var(--IDS-INPUT__BACKGROUND-COLOR)',
            border: 'var(--IDS-INPUT__BORDER-COLOR)',
          },
          surface: {
            background: 'var(--ids-color-surface-background-default)',
            alternative: 'var(--ids-color-surface-background-alternative)',
            border: 'var(--ids-color-surface-border-default)',
            text: 'var(--ids-color-surface-text-on-default)',
            subtle: 'var(--ids-color-surface-text-subtle-on-default)',
          },
          interactive: {
            default: 'var(--ids-color-interactive-background-default)',
            hover: 'var(--ids-color-interactive-background-hover)',
            active: 'var(--ids-color-interactive-background-active)',
          },
          feedback: {
            info: 'var(--ids-color-feedback-background-information)',
            success: 'var(--ids-color-feedback-background-success)',
            attention: 'var(--ids-color-feedback-background-attention)',
            error: 'var(--ids-color-feedback-background-error)',
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
