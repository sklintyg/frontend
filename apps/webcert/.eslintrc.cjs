module.exports = {
  root: true,
  extends: ['react', 'plugin:jest/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json',
  },
  // TODO: Remove overrides added because of legacy code
  rules: {
    '@typescript-eslint/dot-notation': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false, variables: false }],
    'array-callback-return': 'off',
    'arrow-body-style': 'off',
    'consistent-return': 'off',
    'default-case': 'off',
    'default-param-last': 'off',
    'dot-notation': 'off',
    'guard-for-in': 'off',
    'import/no-cycle': 'off',
    'import/no-useless-path-segments': 'off',
    'import/order': 'off',
    'import/prefer-default-export': 'off',
    'jest/no-disabled-tests': 'off',
    'import/no-default-export': 'off',
    'jsx-a11y/alt-text': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/aria-activedescendant-has-tabindex': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/no-noninteractive-tabindex': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'no-bitwise': 'off',
    'no-continue': 'off',
    'no-else-return': 'off',
    'no-lonely-if': 'off',
    'no-nested-ternary': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-promise-executor-return': 'off',
    'no-restricted-globals': 'off',
    'no-restricted-syntax': 'off',
    'no-return-assign': 'off',
    'no-shadow': 'off',
    'no-underscore-dangle': 'off',
    'no-unneeded-ternary': 'off',
    'no-unsafe-optional-chaining': 'off',
    'no-unused-expressions': 'off',
    'no-use-before-define': 'off',
    'no-useless-return': 'off',
    'no-void': 'off',
    'object-shorthand': 'off',
    'one-var': 'off',
    'prefer-arrow-callback': 'off',
    'prefer-destructuring': 'off',
    'prefer-template': 'off',
    'react/button-has-type': 'off',
    'react/destructuring-assignment': 'off',
    'react/display-name': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-boolean-value': 'off',
    'react/jsx-curly-brace-presence': 'off',
    'react/jsx-no-constructed-context-values': 'off',
    'react/jsx-no-useless-fragment': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-array-index-key': 'off',
    'react/no-danger': 'off',
    'react/no-unescaped-entities': 'off',
    'react/no-unknown-property': 'off',
    'react/no-unused-prop-types': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/self-closing-comp': 'off',
    'spaced-comment': 'off',
    camelcase: 'off',
    eqeqeq: 'off',
    radix: 'off',
  },
  ignorePatterns: ['**/*/*stories*', 'coverage/**/*.*'],
  settings: {
    react: {
      version: 'detect',
    },
  },
}