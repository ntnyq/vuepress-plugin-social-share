const { createApp, testCases } = require('./utils')
const { options } = require('./options')

options.forEach(option => {
  describe(option.name, () => {
    let app

    beforeEach(async () => {
      app = createApp(option.options)
      return app.process()
    })

    testCases.forEach(({ name, content }) => {
      test(name, () => {
        const { html } = app.markdown.render(content)

        expect(html).toMatchSnapshot()
      })
    })
  })
})
