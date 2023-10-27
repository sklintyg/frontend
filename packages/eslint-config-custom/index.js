/* eslint-env node */
module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:promise/recommended',
    'plugin:jsdoc/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'import/no-relative-packages': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.test.*', '**/*.spec.*', '**/*.stories.*', '**/*.config.*', '**/*setupTests.*', '**/*fake*', 'mocks/**/*'] },
    ],
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'jsdoc/require-jsdoc': 'off',
    'jsdoc/require-param': 'off',
    'jsdoc/require-returns': 'off',
    'no-use-before-define': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    semi: ['error', 'never'],
    'semi-spacing': ['error', { before: false, after: true }],
    'quote-props': ['error', 'as-needed'],
    quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }],
  },
  ignorePatterns: ['dist/**', '**/dist/**', 'public/**', '**/public/**'],
  settings: {
    jest: {
      version: 29,
    },
    'import/resolver': {
      typescript: {},
    },
  },
}
