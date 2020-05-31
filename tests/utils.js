const { createApp } = require('@vuepress/core')
const {
  fs,
  path,
  parseFrontmatter,
} = require('@vuepress/shared-utils')

const fragmentDir = path.join(__dirname, 'fragments')

module.exports.createApp = (pluginOptions) => createApp({
  plugins: [
    [require('..'), pluginOptions],
  ],
})

module.exports.testCases = fs.readdirSync(fragmentDir).map(name => {
  const filePath = path.join(fragmentDir, name)
  const rawFile = fs.readFileSync(filePath, 'utf8')
  const { content } = parseFrontmatter(rawFile)

  return { name, content }
})
