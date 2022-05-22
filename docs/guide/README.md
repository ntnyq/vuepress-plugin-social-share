---
sidebarDepth: 3
---

# Guide

**vuepress-plugin-social-share** is a VuePress plugin which provides social sharing services.

## Install

```bash
$ npm install vuepress-plugin-social-share@next -D
# or
$ yarn add vuepress-plugin-social-share@next -D
```

## Usage

> See [Official Docs](https://v2.vuepress.vuejs.org/guide/plugin.html#plugin) about how to use a plugin in VuePress.

For `.vuepress/config.js`:

```js
const { socialSharePlugin } = require(`vuepress-plugin-social-share`)

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

## Options

For advanced usage.

```ts
import { defineUserConfig } from '@vuepress/cli'
import {
  type SocialShareNetworkData,
  socialSharePlugin,
} from 'vuepress-plugin-social-share'

const extendsNetworks: SocialShareNetworkData = {
  pinterest: {
    sharer: `https://pinterest.com/pin/create/button/?url=@url&media=@media&description=@title`,
    type: `popup`,
    icon: `/pinterest.png`,
  },
  linkedin: {
    sharer: `https://www.linkedin.com/shareArticle?mini=true&url=@url&title=@title&summary=@description`,
    type: `popup`,
    color: `#1786b1`,
    icon: `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M910.336 0H113.664A114.005333 114.005333 0 0 0 0 113.664v796.672A114.005333 114.005333 0 0 0 113.664 1024h796.672A114.005333 114.005333 0 0 0 1024 910.336V113.664A114.005333 114.005333 0 0 0 910.336 0zM352.256 796.330667H207.189333V375.466667h145.066667z m-72.021333-477.866667a77.824 77.824 0 0 1-81.237334-74.069333A77.824 77.824 0 0 1 280.234667 170.666667a77.824 77.824 0 0 1 81.237333 73.728 77.824 77.824 0 0 1-81.237333 73.386666z m582.314666 477.866667H716.8v-227.669334c0-46.762667-18.432-93.525333-73.045333-93.525333a84.992 84.992 0 0 0-81.237334 94.549333v226.304h-140.629333V375.466667h141.653333v60.757333a155.989333 155.989333 0 0 1 136.533334-71.338667c60.416 0 163.498667 30.378667 163.498666 194.901334z" /></svg>`,
  },
  twitter: {
    color: `#f00`,
  },
}

export default defineUserConfig({
  plugins: [
    socialSharePlugin({
      networks: [`twitter`, `facebook`, `email`, `pinterest`, `linkedin`],
      email: `ntnyq13@gmail.com`,
      twitterUser: `ntnyq`,
      fallbackImage: `/social-share.png`,
      autoQuote: true,
      isPlain: true,
      qrcodeOptions: {
        width: 240,
      },
      extendsNetworks,
    }),
  ],
})
```

### networks

-   **type:** `string[]`
-   **default** `['twitter', 'facebook', 'reddit']`

Default networks set for all your social share component, no matter it's in global or local mode.

Currently, networks below are built-in supported:

-   facebook <social-share class="list-demo-sns" :networks="['facebook']"/>
-   line <social-share class="list-demo-sns" :networks="['line']"/>
-   reddit <social-share class="list-demo-sns" :networks="['reddit']"/>
-   email <social-share class="list-demo-sns" :networks="['email']"/>
-   skype <social-share class="list-demo-sns" :networks="['skype']"/>
-   telegram <social-share class="list-demo-sns" :networks="['telegram']"/>
-   twitter <social-share class="list-demo-sns" :networks="['twitter']"/>
-   weibo <social-share class="list-demo-sns" :networks="['weibo']"/>
-   qq <social-share class="list-demo-sns" :networks="['qq']"/>
-   douban <social-share class="list-demo-sns" :networks="['douban']"/>
-   whatsapp <social-share class="list-demo-sns" :networks="['whatsapp']"/>
-   wechat <social-share class="list-demo-sns" :networks="['wechat']" />

### email

<badge>v0.3.0+</badge>

-   **type:** `string`
-   **default** `undefined`

Your email address.

::: warning Note
There is no single, standard way in which browsers/email clients handle mailto links (e.g. subject and body fields may be discarded without a warning). Also there is a risk that popup and ad blockers, anti-virus software etc. may silently block forced opening of mailto links.

Mailto only launches the MUA(Mail User Agent) which is configured as the default in the system-settings.
:::

**Reference**:

-   [Automatically open default email client and pre-populate content](https://stackoverflow.com/questions/13231125/automatically-open-default-email-client-and-pre-populate-content)
-   [Open email client through javascript](https://stackoverflow.com/questions/22941457/open-email-client-through-javascript)

### twitterUser

-   **type:** `string`
-   **default** `undefined`

Your Twitter profile username.

### weiboAppKey

<badge type="danger">Removed since v0.3.0</badge>

-   **type:** `string`
-   **default** `undefined`

Your Weibo app key.

### fallbackImage

-   **type:** `string`
-   **default** `undefined`

A fallback share image if the page has no share image specified.

You can provide a network image url or an absolute path resolve based on `.vuepress/public`.

```ts
import { defineUserConfig } from '@vuepress/cli'
import { socialSharePlugin } from 'vuepress-plugin-social-share'

// Network image
export default defineUserConfig({
  plugins: [
    socialSharePlugin({
      fallbackImage: `https://vuepress.vuejs.org/hero.png`,
    }),
  ],
})
```

```ts
import { defineUserConfig } from '@vuepress/cli'
import { socialSharePlugin } from 'vuepress-plugin-social-share'

// Public image file
export default defineUserConfig({
  plugins: [
    socialSharePlugin({
      fallbackImage: `/hero.png`,
    }),
  ],
})
```

### autoQuote

-   **type:** `boolean`
-   **default** `true`

For Facebook, use the share meta [description](/guide/#description) as the share quote content.

### isPlain

-   **type:** `boolean`
-   **default** `false`

You can set `isPlain` to `true` if you don't like that all share icons have different colors.

All share icon colors will be set as the [\$accentColor](/guide/#custom-style) by default.

### qrcodeOptions

-   **type:** `object`
-   **default**: `{ errorCorrectionLevel: 'H', width: 250, scale: 1, margin: 1.5 }`

We use [qrcode](https://github.com/soldair/node-qrcode) to generate the qrcode image.

See it's [options](https://github.com/soldair/node-qrcode#qr-code-options) for more information.

### extendsNetworks

-   **type:** `object`
-   **default** `undefined`

With this option, you can add your custom sharer or override the [built-in networks config](https://github.com/ntnyq/vuepress-plugin-social-share/blob/master/lib/networks.json).

i.e:

```ts
import { defineUserConfig } from '@vuepress/cli'
import {
  type SocialShareNetworkData,
  socialSharePlugin,
} from 'vuepress-plugin-social-share'

const extendsNetworks: SocialShareNetworkData = {
  pinterest: {
    sharer: `https://pinterest.com/pin/create/button/?url=@url&media=@media&description=@title`,
    type: `popup`,
    icon: `/pinterest.png`,
  },
  linkedin: {
    sharer: `https://www.linkedin.com/shareArticle?mini=true&url=@url&title=@title&summary=@description`,
    type: `popup`,
    color: `#1786b1`,
    icon: `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M910.336 0H113.664A114.005333 114.005333 0 0 0 0 113.664v796.672A114.005333 114.005333 0 0 0 113.664 1024h796.672A114.005333 114.005333 0 0 0 1024 910.336V113.664A114.005333 114.005333 0 0 0 910.336 0zM352.256 796.330667H207.189333V375.466667h145.066667z m-72.021333-477.866667a77.824 77.824 0 0 1-81.237334-74.069333A77.824 77.824 0 0 1 280.234667 170.666667a77.824 77.824 0 0 1 81.237333 73.728 77.824 77.824 0 0 1-81.237333 73.386666z m582.314666 477.866667H716.8v-227.669334c0-46.762667-18.432-93.525333-73.045333-93.525333a84.992 84.992 0 0 0-81.237334 94.549333v226.304h-140.629333V375.466667h141.653333v60.757333a155.989333 155.989333 0 0 1 136.533334-71.338667c60.416 0 163.498667 30.378667 163.498666 194.901334z" /></svg>`,
  },
  twitter: {
    color: `#f00`,
  },
}

export default defineUserConfig({
  plugins: [
    socialSharePlugin({
      networks: [`twitter`, `facebook`, `email`, `pinterest`, `linkedin`],
      extendsNetworks,
    }),
  ],
})
```

1. You need to specific the `extendsNetworks` option with an object which `key` will be sharer's name and `value` will be options

2. Config the plugin's `networks` option if you want to add custom sharer to `GlobalSocialShare`

3. You can override the built-in networks config by given its options a different value

Custom sharer's option:

#### sharer

-   **type:** `string`
-   **required** `true`

You can use placeholders below in the sharer, it will be replaced by [Share Meta](#share-meta)

-   `@url` [url](#url)
-   `@title` [title](#title)
-   `@media` [media](#media)
-   `@description` [description](#description)
-   `@quote` [quote](#quote)
-   `@hashtags` [hashtags](#hashtags)

#### type

-   **type:** `string`
-   **default** `undefined`
-   **required** `true`

-   `popup` Open a new browser window for sharing service, mostly you need this
-   `direct` Open the sharer in current window directly. For `mailto:`, `sms:` and other built-in protocol
-   `qrcode` Open a model to show the qrcode of current page

The plugin does nothing if you haven't config `type` properly.

#### color

-   **type:** `string`
-   **default** `''`

Set the svg element color if you use it as sharer's icon.

#### icon

-   **type:** `string`
-   **required** `true`

You can set `icon` with a **network image**, an **image in your public folder with an absolute path** or an **svg element**.

### noGlobalSocialShare

<badge>v0.2.0+</badge>

-   **type:** `boolean`
-   **default** `false`

Set it to `true` if you want to disable the global social share component.

If you only want to disable global social share in some specific page, check [Disable social share](#disable-social-share).

## Component Props

The props of `SocialShare` component.

### networks

Same as the plugin's option [networks](/guide/#networks), but with a higher priority.

### tags

-   **type:** `string[]`
-   **default** `[]`

Share tags for Twitter and Facebook.

### isPlain

Same as the plugin's option [isPlain](/guide/#isplain), but with a higher priority.

## Share meta

Meta data for social share services.

Each meta data are listed following its priority.

### url

-   `$frontmatter.$shareUrl`

-   `$frontmatter.shareUrl`

-   `location.href`

### title

-   `$frontmatter.$shareTitle`

-   `s$frontmatter.shareTitle`

-   `$frontmatter.title`

-   `document.title`

### description

-   `$frontmatter.$shareDescription`

-   `$frontmatter.shareDescription`

-   `$frontmatter.description`

-   `<meta name="description" />'s content`

-   `themeConfig.description`

### image

-   `$frontmatter.$shareImage`

-   `$frontmatter.shareImage`

-   `$frontmatter.image`

-   `plugin option's fallbackImage`

### quote

-   `$frontmatter.$shareQuote`

-   `$frontmatter.shareQuote`

-   fallback to [description](/guide/#description) when [autoQuote](/guide/#autoquote) is true.

### hashtags

-   `$frontmatter.$shareTags`

-   `$frontmatter.shareTags`

-   `$frontmatter.tags`

-   `$frontmatter.tag`

-   `Component's prop tags`

-   `<meta name="keywords" />'s content`

## Custom style

By default, those variables are set to **vuepress-plugin-social-share**.

```scss
:root {
    // global trigger color
    --c-social-share-trigger: var(--c-text-lightest);

    // plain mode icon color
    --c-social-share-plain: var(--c-brand);

    // global bgColor
    --c-bg-global-social-share: var(--c-bg);
}
```

Override it in your stylesheet if needed.

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
