export const colors = {
  black: '#000',
  white: '#FFF',
  primary: {
    30: 'var(--ids-palette-primary-30)',
    35: 'var(--ids-palette-primary-30)', // v9 has no primary-35, use primary-30
    40: 'var(--ids-palette-primary-40)',
    50: 'var(--ids-palette-primary-50)',
    90: 'var(--ids-palette-primary-90)',
  },
  accent: {
    30: 'var(--ids-palette-accent-30)',
    40: 'var(--ids-palette-accent-40)',
    90: 'var(--ids-palette-accent-90)',
    95: 'var(--ids-palette-accent-95)',
  },
  secondary: {
    40: 'var(--ids-palette-secondary-90)', // v9 has no secondary-40, use secondary-90
    90: 'var(--ids-palette-secondary-90)',
    95: 'var(--ids-palette-secondary-95)',
  },
  success: {
    30: 'var(--ids-palette-success-40)', // v9 has no success-30, use success-40
    40: 'var(--ids-palette-success-40)',
    99: 'var(--ids-palette-success-95)', // v9 has no success-99, use success-95
  },
  attention: {
    40: 'var(--ids-palette-attention-40)',
    95: 'var(--ids-palette-attention-95)',
  },
  neutral: {
    20: 'var(--ids-palette-neutral-20)',
    40: 'var(--ids-palette-neutral-40)',
    50: 'var(--ids-palette-neutral-60)', // v9 has no neutral-50, use neutral-60
    90: 'var(--ids-palette-neutral-90)',
    99: 'var(--ids-palette-neutral-99)',
    100: 'var(--ids-palette-neutral-100)',
  },
  error: {
    40: 'var(--ids-palette-error-40)',
    99: 'var(--ids-palette-error-95)', // v9 has no error-99, use error-95
  },
  background: 'var(--ids-color-surface-background-default)',
  'on-primary': {
    30: 'var(--ids-color-brand-text-on-primary)',
    40: 'var(--ids-color-brand-text-on-primary)',
    50: 'var(--ids-color-brand-text-on-primary)',
  },
  'on-secondary': {
    40: 'var(--ids-color-brand-text-on-secondary)',
    90: 'var(--ids-color-brand-text-on-secondary)',
    95: 'var(--ids-color-brand-text-on-secondary)',
  },
  'on-accent': {
    30: 'var(--ids-color-interactive-text-on-hover)',
    40: 'var(--ids-color-interactive-text-on-default)',
    90: 'var(--ids-color-interactive-text-on-disabled)',
  },
  graphic: 'var(--ids-color-brand-background-primary)',
  alternative: 'var(--ids-color-surface-background-alternative)',
  'on-neutral': {
    20: 'var(--ids-palette-neutral-100)',
    40: 'var(--ids-palette-neutral-100)',
    90: 'var(--ids-palette-neutral-20)',
    99: 'var(--ids-palette-neutral-20)',
  },
  'on-background': 'var(--ids-color-surface-text-on-default)',
  'on-success': {
    40: 'var(--ids-color-feedback-text-on-success)',
    99: 'var(--ids-color-feedback-text-on-success)',
  },
  'on-attention': {
    40: 'var(--ids-color-feedback-text-on-attention)',
    95: 'var(--ids-color-feedback-text-on-attention)',
  },
  'on-error': {
    40: 'var(--ids-color-feedback-text-on-error)',
    99: 'var(--ids-color-feedback-text-on-error)',
  },
} as const
