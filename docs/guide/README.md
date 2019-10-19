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

Config in your `.vuepress/config.js`:

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
// .vuepress/config.js

const extendsNetworks = {
  email: {
    sharer: 'mailto:?subject=@title&body=@url%0D%0A%0D%0A@description',
    type: 'direct',
    icon: '/email.png',
  },
}

module.exports = {
  plugins: [
    ['social-share', {
      networks: ['twitter', 'facebook', 'reddit', 'telegram'],
      twitterUser: 'ntnyq',
      weiboAppKey: 'your_app_key',
      fallbackImage: '/hero.png',
      autoQuote: true,
      isPlain: false,
      extendsNetworks,
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

### extendsNetworks

- __type:__ `object`
- __default__ `undefined`

With this option, you can add your custom sharer or override the [built-in networks config](https://github.com/ntnyq/vuepress-plugin-social-share/blob/master/lib/networks.json).

i.e:

``` js
const extendsNetworks = {
  email: {
    sharer: 'mailto:?subject=@title&body=@url%0D%0A%0D%0A@description',
    type: 'direct',
    icon: '/email.png',
  },
  pinterest: {
    sharer: 'https://pinterest.com/pin/create/button/?url=@url&media=@media&description=@title',
    type: 'popup',
    icon: '/pinterest.png',
  },
  linkedin: {
    sharer: 'https://www.linkedin.com/shareArticle?mini=true&url=@url&title=@title&summary=@description',
    type: 'popup',
    color: '#1786b1',
    icon: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M910.336 0H113.664A114.005333 114.005333 0 0 0 0 113.664v796.672A114.005333 114.005333 0 0 0 113.664 1024h796.672A114.005333 114.005333 0 0 0 1024 910.336V113.664A114.005333 114.005333 0 0 0 910.336 0zM352.256 796.330667H207.189333V375.466667h145.066667z m-72.021333-477.866667a77.824 77.824 0 0 1-81.237334-74.069333A77.824 77.824 0 0 1 280.234667 170.666667a77.824 77.824 0 0 1 81.237333 73.728 77.824 77.824 0 0 1-81.237333 73.386666z m582.314666 477.866667H716.8v-227.669334c0-46.762667-18.432-93.525333-73.045333-93.525333a84.992 84.992 0 0 0-81.237334 94.549333v226.304h-140.629333V375.466667h141.653333v60.757333a155.989333 155.989333 0 0 1 136.533334-71.338667c60.416 0 163.498667 30.378667 163.498666 194.901334z" /></svg>',
  },
  twitter: {
    color: '#f00'
  }
}

module.exports = {
  plugins: [
    ['social-share', {
      networks: ['twitter', 'facebook', 'email', 'pinterest', 'linkedin'],
      extendsNetworks,
    }]
  ]
}
```

1. You need to specific the `extendsNetworks` option with an object which `key` will be sharer's name and `value` will be options

2. Config the plugin's `networks` option if you want to add custom sharer to `GlobalSocialShare`

3. You can override the built-in networks config by given its options a different value

Custom sharer's option: 

#### sharer

- __type:__ `string`
- __required__ `true`

You can use placeholders below in the sharer, it will be replaced by [Share Meta](#share-meta)

- `@url`  [url](#url)
- `@title`  [title](#title)
- `@media`  [media](#media)
- `@description`  [description](#description)
- `@quote`  [quote](#quote)
- `@hashtags` [hashtags](#hashtags)

#### type

- __type:__ `string`
- __default__ `undefined`
- __required__ `true`

- `popup` Open a new browser window for sharing service, mostly you need this
- `direct` Open sharer in current window directly. For `mailto:`, `sms:` and other built-in protocal

The plugin does nothing if you don't provide a type.

#### color 

- __type:__ `string`
- __required__ `''`

Set the svg element color if you use it as sharer's icon.

#### icon

- __type:__ `string`
- __required__ `true`

You can set `icon` with a __network image__, an __image in your public folder with absolute path__ or a __svg element__.

## Component Props

The props of `SocialShare` component.

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
