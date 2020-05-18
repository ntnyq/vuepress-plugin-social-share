const { resolve } = require('path')
const { readFileSync } = require('fs')
const { createApp } = require('@vuepress/core')
const {
  pluginsWithOptions,
  // pluginsWithoutOptions,
  // pluginsNoGlobalSocialShare,
} = require('./plugins')

describe('with-options', () => {
  const app = createApp({
    sourceDir: resolve(__dirname, 'fixtures/docs'),
    dest: resolve(__dirname, 'dist/without-option'),
    plugins: pluginsWithOptions,
  })

  beforeEach(async () => {
    await app.process()
    await app.build()
  }, 6e4)

  function testForFile (name, file = name) {
    test(name, () => {
      const html = readFileSync(resolve(app.options.dest, file), 'utf8')

      expect(html).toMatchSnapshot()
    })
  }

  testForFile('index.html')
  testForFile('demo.html')
})

// describe('without-options', () => {
//   const app = createApp({
//     sourceDir: resolve(__dirname, 'docs'),
//     dest: resolve(__dirname, 'dist/without-option'),
//     plugins: pluginsWithoutOptions,
//   })

//   beforeEach(async () => {
//     await app.process()
//     await app.build()
//   }, 6e4)

//   function testForFile (name, file = name) {
//     test(name, () => {
//       const html = readFileSync(resolve(app.outDir, file), 'utf8')

//       expect(html).toMatchSnapshot()
//     })
//   }

//   testForFile('index.html')
//   testForFile('demo.html')
// })

// describe('no-global-social-share', () => {
//   const app = createApp({
//     sourceDir: resolve(__dirname, 'docs'),
//     dest: resolve(__dirname, 'dist/no-global-social-share'),
//     plugins: pluginsNoGlobalSocialShare,
//   })

//   beforeEach(async () => {
//     await app.process()
//     await app.build()
//   }, 6e4)

//   function testForFile (name, file = name) {
//     test(name, () => {
//       const html = readFileSync(resolve(app.outDir, file), 'utf8')

//       expect(html).toMatchSnapshot()
//     })
//   }

//   testForFile('index.html')
//   testForFile('demo.html')
// })
