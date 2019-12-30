module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/strongly-recommended',
    'goy',
  ],

  parserOptions: {
    parser: 'babel-eslint',
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/__mock__/*.{j,y}s?(x)',
        '**/tests/**/*.spec.{j,t}s?(x)',
      ],

      env: {
        jest: true,
      },
    },
  ],
}
