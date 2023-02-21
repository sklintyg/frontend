module.exports = {
  extends: [
    'airbnb',
    'eslint:recommended',
    'plugin:n/recommended',
    'plugin:promise/recommended',
    'plugin:jsdoc/recommended',
    'turbo',
    'prettier',
  ],
  plugins: ['unused-imports'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': ['warn', { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }],
    'import/no-relative-packages': 'error',
    'jsdoc/require-jsdoc': 'off',
    'jsdoc/require-param': 'off',
    'jsdoc/require-returns': 'off',
  },
  ignorePatterns: ['dist/**'],
  parserOptions: {
    project: './tsconfig.json',
  },
}
