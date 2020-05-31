const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname),

  testEnvironment: 'node',

  testMatch: [
    '<rootDir>/tests/**/*.spec.js',
  ],

  moduleNameMapper: {
    [`^vuepress-plugin-social-share$`]: '<rootDir>/lib',
  },

  snapshotSerializers: [require.resolve('jest-serializer-vue')],

  collectCoverageFrom: [
    '<rootDir>/lib/**/*.js',
  ],

  coverageDirectory: 'coverage',
}
