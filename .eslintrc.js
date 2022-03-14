module.exports = {
  root: true,

  extends: [`@ntnyq/vue`],

  rules: {
    'max-len': `off`,
    'vue/no-v-html': `off`,
    'vue/one-component-per-file': `off`,
    'vue/require-name-property': `off`,
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
