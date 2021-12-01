module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  rules: {
    'max-classes-per-file': 'off',
    'linebreak-style': 'off',
    'import/no-extraneous-dependencies': 'off',
    'quote-props': 'off',
    'object-curly-newline': 'off',
    'no-param-reassign': 'off',
    'no-shadow': 'off',
    'import/prefer-default-export': 'off',
    'no-use-before-define': 'off',
    'no-restricted-syntax': 'off',
    'brace-style': 'off',
    'semi': ['error', 'never'],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'import/extensions': ['error', 'always',
      {
        js: 'always',
      },
    ],
  },
}