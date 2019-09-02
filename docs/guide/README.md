# Guide

__vuepress-plugin-social-share__ is a VuePress plugin which provides social sharing services.

## Install

``` bash
$ npm install vuepress-plugin-social-share -D
# or
$ yarn add vuepress-plugin-social-share -D
```

## Usage

> See [Official Docs](https://v1.vuepress.vuejs.org/zh/plugin/using-a-plugin.html) about how to use a plugin in VuePress.

Add __vuepress-plugin-social-share__ to your config file.

``` js
module.exports = {
  plugins: [
    'social-share'
  ]
}
```

## Configurations

For advanced usage.

``` js
module.exports = {
  plugins: [
    ['social-share', {
      networks: ['twitter', 'facebook', 'reddit', 'telegram'],
      twitterUser: 'ntnyq',
      weiboAppKey: 'your_app_key',
      fallbackImage: '/hero.png',
      autoQuote: true,
      isPlain: false
    }]
  ]
}
```

### networks

- __type:__ `string[]`
- __default__ `['twitter', 'facebook', 'reddit']`

Default networks set for social sharing service.

Currently, networks below are built-in supported:

- facebook <social-share class="list-demo-sns" :networks="['facebook']"/>
- line <social-share class="list-demo-sns" :networks="['line']"/>
- reddit <social-share class="list-demo-sns" :networks="['reddit']"/>
- skype <social-share class="list-demo-sns" :networks="['skype']"/>
- telegram <social-share class="list-demo-sns" :networks="['telegram']"/>
- twitter <social-share class="list-demo-sns" :networks="['twitter']"/>
- weibo <social-share class="list-demo-sns" :networks="['weibo']"/>
- qq <social-share class="list-demo-sns" :networks="['qq']"/>
- douban <social-share class="list-demo-sns" :networks="['douban']"/>
- whatsapp <social-share class="list-demo-sns" :networks="['whatsapp']"/>

### twitterUser

- __type:__ `string`
- __default__ `undefined`

Your Twitter profile username.

### weiboAppKey

- __type:__ `string`
- __default__ `undefined`

Your Weibo app key.

### fallbackImage

- __type:__ `string`
- __default__ `undefined`

A fallback share image if the page has no share image specified.

You can provide a network image url or an absolute path resolve based on `.vuepress/public`.

``` js
// Network image
module.exports = {
  plugins: [
    ['social-share', {
      fallbackImage: 'https://vuepress.vuejs.org/hero.png'
    }]
  ]
}

// Public file
module.exports = {
  plugins: [
    ['social-share', {
      fallbackImage: '/hero.png'
    }]
  ]
}
```

### autoQuote

- __type:__ `boolean`
- __default__ `true`

For Facebook, use the share description as share quote content.

### isPlain

- __type:__ `boolean`
- __default__ `false`

Maybe you don't like the share icons have different colors and you can set `isPlain` to `true`.

All share icon colors will be set as the `$accentColor` by default.

## Component options

The `SocialShare` component's props.

### networks

Same as the plugin's option `networks`, but with a higher priority.

### tags

- __type:__ `string[]`
- __default__ `[]`

Share tags for Twitter and Facebook.

### isPlain

Same as the plugin's option `isPlain`, but with a higher priority.

## Share meta

Meta data for social share services.

Each meta data are listed following its priority.

### url

- `$frontmatter.$shareUrl` 

- `$frontmatter.shareUrl` 

- `location.href`

### title

- `$frontmatter.$shareTitle`

- `s$frontmatter.hareTitle` 

- `$frontmatter.title` 

- `document.title`

### description

- `$frontmatter.$shareDescription` 

- `$frontmatter.shareDescription` 

- `$frontmatter.description` 

- `<meta name="description" />'s content` 

- `themeConfig.description`

### image

- `$frontmatter.$shareImage`

- `$frontmatter.shareImage`

- `$frontmatter.image`

- `plugin option's fallbackImage`

### quote

- `$frontmatter.$shareQuote`

- `$frontmatter.shareQuote`

- fallback to __description__ if `autoQuote` is true.

### hashtags

- `$frontmatter.$shareTags`

- `$frontmatter.shareTags`

- `$frontmatter.tags`

- `$frontmatter.tag`

- `Component's prop tags`

- `<meta name="keywords" />'s content` 

## Custom style

By default, those variables are set to __vuepress-plugin-social-share__.

``` stylus
// vuepress-plugin-social-share/lib/styles/index.styl

$social-share-plain-color ?= $accentColor
$social-share-trigger-color ?= lighten($textColor, 40%)
$social-share-mobile ?= $MQMobile
```

If you want to override them, just set them in your `palette.styl`:

``` stylus
// .vuepress/styles/palette.styl

$social-share-plain-color = red
```

## Disable

You can disable __vuepress-plugin-social-share__ in the markdown frontmatter.

### Disable global component

Set `noGlobalSocialShare` to `true` if you want to disable the global social share component.

``` markdown
---
noGlobalSocialShare: true
---
```

### Disable social share

Set `noSocialShare` to `true` if you want to disable all social share component.

``` markdown
---
noSocialShare: true
---
```
