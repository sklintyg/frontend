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
    'turbo',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'import/no-relative-packages': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.test.*', '**/*.spec.*', '**/*.stories.*', '**/*.config.*', '**/*setupTests.*'] },
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
    'turbo/no-undeclared-env-vars': ['error', { allowList: ['^VITE_[A-Z_]+$'] }],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
  },
  ignorePatterns: ['dist/**'],
}
