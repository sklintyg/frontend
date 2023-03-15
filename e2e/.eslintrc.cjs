module.export = {
  root: true,
  extends: ['custom', 'plugin:cypress/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'promise/catch-or-return': 'off',
    'promise/always-return': 'off',
    'no-param-reassign': 'off',
  },
}
