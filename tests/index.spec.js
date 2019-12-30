const { resolve } = require('path')
const { readFileSync } = require('fs')
const { createApp } = require('@vuepress/core')
const { pluginsWithOptions, pluginsWithoutOptions } = require('./plugins')

describe('with-options', () => {
  const app = createApp({
    sourceDir: resolve(__dirname, 'docs'),
    dest: resolve(__dirname, 'dist/with-option'),
    plugins: pluginsWithOptions,
  })

  beforeEach(async () => {
    await app.process()
    await app.build()
  }, 6e4)

  function testForFile (name, file = name) {
    test(name, () => {
      const html = readFileSync(resolve(app.outDir, file), 'utf8')

      expect(html).toMatchSnapshot()
    })
  }

  testForFile('index.html')
  testForFile('demo.html')
})

describe('without-options', () => {
  const app = createApp({
    sourceDir: resolve(__dirname, 'docs'),
    dest: resolve(__dirname, 'dist/without-option'),
    plugins: pluginsWithoutOptions,
  })

  beforeEach(async () => {
    await app.process()
    await app.build()
  }, 6e4)

  function testForFile (name, file = name) {
    test(name, () => {
      const html = readFileSync(resolve(app.outDir, file), 'utf8')

      expect(html).toMatchSnapshot()
    })
  }

  testForFile('index.html')
  testForFile('demo.html')
})
