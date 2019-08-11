# vuepress-plugin-social-share

[![CIRCLECI](https://img.shields.io/circleci/project/ntnyq/vuepress-plugin-social-share/master.svg?logo=circleci)](https://circleci.com/gh/ntnyq/vuepress-plugin-social-share)
[![NPM VERSION](https://img.shields.io/npm/v/vuepress-plugin-svg-icons.svg)](https://www.npmjs.com/package/vuepress-plugin-svg-icons)
[![NPM DOWNLOADS](https://img.shields.io/npm/dy/vuepress-plugin-svg-icons.svg)](https://www.npmjs.com/package/vuepress-plugin-svg-icons)
[![LICENSE](https://img.shields.io/github/license/ntnyq/vuepress-plugin-social-share.svg)](https://github.com/ntnyq/vuepress-plugin-social-share/blob/master/LICENSE)

:mega: Social sharing plugin for [VuePress](https://vuepress.vuejs.org)

:book: [Live Demo and Docs](https://sns.goyfe.com)

## Status

__WIP__ :muscle:

## Install

``` bash
$ npm install vuepress-plugin-social-share
# OR
$ yarn add vuepress-plugin-social-share
```

## Usage

Add config to `.vuepress-config.js`:

``` js
module.exports = {
  plugins: [
    'social-share'
  ]
}
```

``` markdown
<social-share :is-global="false" />
```

[Custom options detail](https://sns.goyfe.com/guide)

## Prior Art

Deeply thank to [Vue Social Sharing](https://github.com/nicolasbeauvais/vue-social-sharing) for the component api source code.

## License

[MIT](./LICENSE) &copy; [@ntnyq](https://github.com/ntnyq)
