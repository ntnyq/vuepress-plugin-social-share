# vuepress-plugin-social-share

[![CI](https://github.com/ntnyq/vuepress-plugin-social-share/workflows/CI/badge.svg)](https://github.com/ntnyq/vuepress-plugin-social-share/actions)
[![NPM VERSION](https://img.shields.io/npm/v/vuepress-plugin-social-share/next.svg)](https://www.npmjs.com/package/vuepress-plugin-social-share/v/next)
[![NPM DOWNLOADS](https://img.shields.io/npm/dy/vuepress-plugin-social-share.svg)](https://www.npmjs.com/package/vuepress-plugin-social-share)
[![LICENSE](https://img.shields.io/github/license/ntnyq/vuepress-plugin-social-share.svg)](https://github.com/ntnyq/vuepress-plugin-social-share/blob/main/LICENSE)

:mega: Social sharing plugin for [VuePress](https://vuepress.vuejs.org)

:book: [Docs for Guide](./docs/guide/README.md)

## ⚠️ Note

Still using VuePress v1?

Please Checkout branch [main](https://github.com/ntnyq/vuepress-plugin-social-share/tree/main) for detail

## Install

```bash
$ npm install vuepress-plugin-social-share@next -D
# OR
$ yarn add vuepress-plugin-social-share@next -D
```

## Usage

For `.vuepress/config.js`:

```js
const { socialSharePlugin } = require('vuepress-plugin-social-share')

module.exports = {
    plugins: [socialSharePlugin()],
}
```

For `.vuepress/config.ts`:

```ts
import { defineUserConfig } from '@vuepress/cli'
import { socialSharePlugin } from 'vuepress-plugin-social-share'

export default defineUserConfig({
    plugins: [socialSharePlugin()],
})
```

:mag: [Custom options detail](./docs/guide/README.md)

## Prior Art

Deeply thank to [vue-social-sharing](https://github.com/nicolasbeauvais/vue-social-sharing) for the component api source code.

## License

[MIT](./LICENSE) &copy; [@ntnyq](https://github.com/ntnyq)
