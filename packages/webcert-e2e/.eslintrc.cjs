module.exports = {
  root: true,
  extends: ['custom', 'plugin:cypress/recommended'],
  rules: {
    'no-console': 'off',
    'no-unused-expressions': 'off',
    'promise/catch-or-return': 'off',
    'promise/always-return': 'off',
  },
}
