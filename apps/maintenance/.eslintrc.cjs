/* eslint-disable @typescript-eslint/no-var-requires */
const REACT_FC_MESSAGE = 'Please use JSX.Element instead. [React.FC](https://github.com/typescript-cheatsheets/react#function-components)'
const path = require('path')

module.exports = {
  root: true,
  extends: ['react', 'plugin:tailwindcss/recommended'],
  overrides: [
    {
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['react', 'react-test'],
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json',
  },
  ignorePatterns: ['**/*/*stories*', 'coverage/**/*.*'],
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
        whitelist: ['ids\\-.*'],
      },
    ],
    'react/no-unknown-property': ['error', { ignore: ['trigger'] }],
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        labelComponents: [],
        labelAttributes: [],
        controlComponents: [],
        assert: 'either',
        depth: 25,
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
    tailwindcss: {
      config: path.resolve(__dirname, './tailwind.config.ts'),
    },
  },
}
