/* eslint-env node */
module.exports = {
  extends: [
    'airbnb',
    'airbnb-typescript',
    'custom',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  rules: {
    'react/jsx-props-no-spreading': 'off',
    'react/no-multi-comp': 'error',
    'react/require-default-props': 'off',
  },
}
