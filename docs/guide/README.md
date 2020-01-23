---
sidebarDepth: 3
---

# Guide

**vuepress-plugin-social-share** is a VuePress plugin which provides social sharing services.

## Install

```bash
$ npm install vuepress-plugin-social-share -D
# or
$ yarn add vuepress-plugin-social-share -D
```

## Usage

> See [Official Docs](https://v1.vuepress.vuejs.org/zh/plugin/using-a-plugin.html) about how to use a plugin in VuePress.

Config in your `.vuepress/config.js`:

```js
module.exports = {
  plugins: ['social-share'],
}
```

## Configurations

For advanced usage.

```js
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
    [
      'social-share',
      {
        networks: ['twitter', 'facebook', 'reddit', 'telegram'],
        twitterUser: 'ntnyq',
        weiboAppKey: 'your_app_key',
        fallbackImage: '/hero.png',
        autoQuote: true,
        isPlain: false,
        extendsNetworks,
      },
    ],
  ],
}
```

### networks

- **type:** `string[]`
- **default** `['twitter', 'facebook', 'reddit']`

Default networks set for all your social share component, no matter it's in global or local mode.

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

- **type:** `string`
- **default** `undefined`

Your Twitter profile username.

### weiboAppKey

- **type:** `string`
- **default** `undefined`

Your Weibo app key.

### fallbackImage

- **type:** `string`
- **default** `undefined`

A fallback share image if the page has no share image specified.

You can provide a network image url or an absolute path resolve based on `.vuepress/public`.

```js
// Network image
module.exports = {
  plugins: [
    [
      'social-share',
      {
        fallbackImage: 'https://vuepress.vuejs.org/hero.png',
      },
    ],
  ],
}

// Public file
module.exports = {
  plugins: [
    [
      'social-share',
      {
        fallbackImage: '/hero.png',
      },
    ],
  ],
}
```

### autoQuote

- **type:** `boolean`
- **default** `true`

For Facebook, use the share meta [description](/guide/#description) as share quote content.

### isPlain

- **type:** `boolean`
- **default** `false`

You can set `isPlain` to `true` if you don't link share icons have different colors.

All share icon colors will be set as the [\$accentColor](/guide/#custom-style) by default.

### extendsNetworks

- **type:** `object`
- **default** `undefined`

With this option, you can add your custom sharer or override the [built-in networks config](https://github.com/ntnyq/vuepress-plugin-social-share/blob/master/lib/networks.json).

i.e:

```js
const extendsNetworks = {
  email: {
    sharer: 'mailto:?subject=@title&body=@url%0D%0A%0D%0A@description',
    type: 'direct',
    icon: '/email.png',
  },
  pinterest: {
    sharer:
      'https://pinterest.com/pin/create/button/?url=@url&media=@media&description=@title',
    type: 'popup',
    icon: '/pinterest.png',
  },
  linkedin: {
    sharer:
      'https://www.linkedin.com/shareArticle?mini=true&url=@url&title=@title&summary=@description',
    type: 'popup',
    color: '#1786b1',
    icon:
      '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M910.336 0H113.664A114.005333 114.005333 0 0 0 0 113.664v796.672A114.005333 114.005333 0 0 0 113.664 1024h796.672A114.005333 114.005333 0 0 0 1024 910.336V113.664A114.005333 114.005333 0 0 0 910.336 0zM352.256 796.330667H207.189333V375.466667h145.066667z m-72.021333-477.866667a77.824 77.824 0 0 1-81.237334-74.069333A77.824 77.824 0 0 1 280.234667 170.666667a77.824 77.824 0 0 1 81.237333 73.728 77.824 77.824 0 0 1-81.237333 73.386666z m582.314666 477.866667H716.8v-227.669334c0-46.762667-18.432-93.525333-73.045333-93.525333a84.992 84.992 0 0 0-81.237334 94.549333v226.304h-140.629333V375.466667h141.653333v60.757333a155.989333 155.989333 0 0 1 136.533334-71.338667c60.416 0 163.498667 30.378667 163.498666 194.901334z" /></svg>',
  },
  twitter: {
    color: '#f00',
  },
}

module.exports = {
  plugins: [
    [
      'social-share',
      {
        networks: ['twitter', 'facebook', 'email', 'pinterest', 'linkedin'],
        extendsNetworks,
      },
    ],
  ],
}
```

1. You need to specific the `extendsNetworks` option with an object which `key` will be sharer's name and `value` will be options

2. Config the plugin's `networks` option if you want to add custom sharer to `GlobalSocialShare`

3. You can override the built-in networks config by given its options a different value

Custom sharer's option:

#### sharer

- **type:** `string`
- **required** `true`

You can use placeholders below in the sharer, it will be replaced by [Share Meta](#share-meta)

- `@url` [url](#url)
- `@title` [title](#title)
- `@media` [media](#media)
- `@description` [description](#description)
- `@quote` [quote](#quote)
- `@hashtags` [hashtags](#hashtags)

#### type

- **type:** `string`
- **default** `undefined`
- **required** `true`

- `popup` Open a new browser window for sharing service, mostly you need this
- `direct` Open sharer in current window directly. For `mailto:`, `sms:` and other built-in protocal

The plugin does nothing if you haven't config `type` properly.

#### color

- **type:** `string`
- **default** `''`

Set the svg element color if you use it as sharer's icon.

#### icon

- **type:** `string`
- **required** `true`

You can set `icon` with a **network image**, an **image in your public folder with absolute path** or an **svg element**.

### noGlobalSocialShare <badge>v0.2.0+</badge>

- **type:** `boolean`
- **default** `false`

Set it to `true` if you want to disable the global social share component.

If you only want to disable global social share in some specific page, check [Disable social share](#disable-social-share).

## Component Props

The props of `SocialShare` component.

### networks

Same as the plugin's option [networks](/guide/#networks), but with a higher priority.

### tags

- **type:** `string[]`
- **default** `[]`

Share tags for Twitter and Facebook.

### isPlain

Same as the plugin's option [isPlain](/guide/#isplain), but with a higher priority.

## Share meta

Meta data for social share services.

Each meta data are listed following its priority.

### url

- `$frontmatter.$shareUrl`

- `$frontmatter.shareUrl`

- `location.href`

### title

- `$frontmatter.$shareTitle`

- `s$frontmatter.shareTitle`

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

- fallback to [description](/guide/#description) when [autoQuote](/guide/#autoquote) is true.

### hashtags

- `$frontmatter.$shareTags`

- `$frontmatter.shareTags`

- `$frontmatter.tags`

- `$frontmatter.tag`

- `Component's prop tags`

- `<meta name="keywords" />'s content`

## Custom style

By default, those variables are set to **vuepress-plugin-social-share**.

```stylus
// vuepress-plugin-social-share/lib/styles/index.styl

$social-share-plain-color ?= $accentColor
$social-share-trigger-color ?= lighten($textColor, 40%)
$social-share-mobile ?= $MQMobile
```

If you want to override them, just set them in your `palette.styl`:

```stylus
// .vuepress/styles/palette.styl

$social-share-plain-color = red
```

## Disable social share

You can disable **vuepress-plugin-social-share** in a specific page by setting the markdown frontmatter.

### Disable global social share

Set `noGlobalSocialShare` to `true` if you want to disable the global social share component.

```markdown
---
noGlobalSocialShare: true
---
```

### Disable all social share

Set `noSocialShare` to `true` if you want to disable all social share component.

```markdown
---
noSocialShare: true
---
```
