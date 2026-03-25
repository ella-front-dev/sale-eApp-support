/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/ban-ts-comment */
module.exports = {
  extends: ['sales-frontend-eslint-config-v8'],
  rules: {
    'react/no-children-prop': 'warn',
    'react/jsx-key': 'warn',
    'react/no-unescaped-entities': 'warn',
    'react/prop-types': 'warn',
    '@typescript-eslint/no-unused-expressions': 'warn',
    '@typescript-eslint/no-empty-object-type': 'off'
  }
};
