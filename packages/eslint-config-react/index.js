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
    'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
    'react/jsx-props-no-spreading': 'off',
    'react/no-multi-comp': 'error',
    'react/require-default-props': 'off',
    'no-restricted-imports': 'off',
    '@typescript-eslint/no-restricted-imports': [
      'error',
      {
        name: 'react-redux',
        importNames: ['useDispatch'],
        message: 'Use typed hook `useAppDispatch` instead.',
      },
      {
        name: 'react-redux',
        importNames: ['useSelector'],
        message: 'Use typed hook `useAppSelector` instead.',
      },
    ],
  },
}
