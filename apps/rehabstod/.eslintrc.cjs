/* eslint-disable @typescript-eslint/no-var-requires */
const twConfig = require('./tailwind.config.cjs')

const REACT_FC_MESSAGE = 'Please use JSX.Element instead. [React.FC](https://github.com/typescript-cheatsheets/react#function-components)'

module.exports = {
  root: true,
  extends: ['react', 'plugin:tailwindcss/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json',
  },
  ignorePatterns: ['**/*/*stories*'],
  rules: {
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          'React.StatelessComponent': { message: REACT_FC_MESSAGE },
          'React.FunctionalComponent': { message: REACT_FC_MESSAGE },
          'React.FC': { message: REACT_FC_MESSAGE },
        },
        extendDefaults: true,
      },
    ],
    'tailwindcss/no-custom-classname': [
      'warn',
      {
        config: twConfig,
        whitelist: ['ids\\-.*'],
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
