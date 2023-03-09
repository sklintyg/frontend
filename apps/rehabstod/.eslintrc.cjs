module.exports = {
  root: true,
  extends: ['react'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json',
  },
  ignorePatterns: ['**/*/*stories*'],
  settings: {
    react: {
      version: 'detect',
    },
  },
}
