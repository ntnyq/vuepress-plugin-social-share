---
pageClass: page-guide
sidebarDepth: 3
---

# Guide

**vuepress-plugin-social-share** is a VuePress plugin which provides social sharing services.

## Install

```shell
npm install vuepress-plugin-social-share@next -D
```

```shell
yarn add vuepress-plugin-social-share@next -D
```

```shell
pnpm add vuepress-plugin-social-share@next -D
```

## Usage

> See [Official Docs](https://v2.vuepress.vuejs.org/guide/plugin.html#plugin) about how to use a plugin in VuePress.

```js
import { defineUserConfig } from 'vuepress'
import { socialSharePlugin } from 'vuepress-plugin-social-share'

export default defineUserConfig({
  plugins: [socialSharePlugin()],
})
```

## Options

For advanced usage.

```ts
import { defineUserConfig } from 'vuepress'
import { socialSharePlugin } from 'vuepress-plugin-social-share'

export default defineUserConfig({
  plugins: [
    socialSharePlugin({
      networks: [
        // enable build-in networks by default
        'twitter',
        'facebook',
        'email',

        // mark user defined networks as default
        'linkedin',

        // add user defined networks
        {
          name: 'pinterest',
          sharer:
            'https://pinterest.com/pin/create/button/?url=@url&media=@media&description=@title',
          type: 'popup',
          icon: '/pinterest.png',
          /**
           * mark this network as default
           */
          default: true,
        },
        {
          name: 'linkedin',
          sharer:
            'https://www.linkedin.com/shareArticle?mini=true&url=@url&title=@title&summary=@description',
          type: 'popup',
          color: '#1786b1',
          icon: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M910.336 0H113.664A114.005333 114.005333 0 0 0 0 113.664v796.672A114.005333 114.005333 0 0 0 113.664 1024h796.672A114.005333 114.005333 0 0 0 1024 910.336V113.664A114.005333 114.005333 0 0 0 910.336 0zM352.256 796.330667H207.189333V375.466667h145.066667z m-72.021333-477.866667a77.824 77.824 0 0 1-81.237334-74.069333A77.824 77.824 0 0 1 280.234667 170.666667a77.824 77.824 0 0 1 81.237333 73.728 77.824 77.824 0 0 1-81.237333 73.386666z m582.314666 477.866667H716.8v-227.669334c0-46.762667-18.432-93.525333-73.045333-93.525333a84.992 84.992 0 0 0-81.237334 94.549333v226.304h-140.629333V375.466667h141.653333v60.757333a155.989333 155.989333 0 0 1 136.533334-71.338667c60.416 0 163.498667 30.378667 163.498666 194.901334z" /></svg>',
        },
        /**
         * override built-in network
         */
        {
          name: 'twitter',
          color: {
            light: '#1786b1',
            dark: '#ff0',
          },
        },
      ],
      twitterUser: 'ntnyq',
      fallbackImage: '/social-share.png',
      autoQuote: true,
      isPlain: true,
      qrcodeOptions: {
        width: 240,
      },
    }),
  ],
})
```

### networks

- **type:** `(string | SocialShareNetworkWithName | OverrideSocialShareNetworkWithName)[]`
- **default** `['twitter', 'facebook', 'reddit']`

```ts
type ThemeableValue<T = string> = T | { light: T; dark: T }
type OverrideSocialShareNetworkWithName =
  Partial<SocialShareNetworkWithName> & {
    name: BuiltInNetworkNames
  }
type SocialShareNetworkWithName = {
  /**
   * Sharer name
   */
  name: string

  /**
   * Sharer icon
   */
  icon: ThemeableValue<string>

  /**
   * Sharer type
   */
  type: 'direct' | 'popup' | 'qrcode'

  /**
   * Sharer icon color
   */
  color?: ThemeableValue<string>

  /**
   * Sharer URL
   */
  sharer?: string

  /**
   * If component `SocialShare` has no prop `networks`, all `default: true` network will show
   */
  default?: boolean
}
```

When given type `string`, the network with this name will be used by default in both global and default **SocialShare** component if prop `networks` is not set.

When given type `SocialShareNetworkWithName`, will override a built-in network with the same name or add a user defined network.

Currently, networks below are built-in supported:

- bluesky <SocialShare class="list-demo-sns" :networks="['bluesky']" />
- douban <SocialShare class="list-demo-sns" :networks="['douban']"/>
- email <SocialShare class="list-demo-sns" :networks="['email']"/>
- facebook <SocialShare class="list-demo-sns" :networks="['facebook']"/>
- line <SocialShare class="list-demo-sns" :networks="['line']"/>
- linkedin <SocialShare class="list-demo-sns" :networks="['linkedin']"/>
- pinterest <SocialShare class="list-demo-sns" :networks="['pinterest']"/>
- qq <SocialShare class="list-demo-sns" :networks="['qq']"/>
- qrcode <SocialShare class="list-demo-sns" :networks="['qrcode']" />
- reddit <SocialShare class="list-demo-sns" :networks="['reddit']"/>
- skype <SocialShare class="list-demo-sns" :networks="['skype']"/>
- telegram <SocialShare class="list-demo-sns" :networks="['telegram']"/>
- threads <SocialShare class="list-demo-sns" :networks="['threads']"/>
- twitter <SocialShare class="list-demo-sns" :networks="['twitter']"/>
- viber <SocialShare class="list-demo-sns" :networks="['viber']"/>
- wechat <SocialShare class="list-demo-sns" :networks="['wechat']" />
- weibo <SocialShare class="list-demo-sns" :networks="['weibo']"/>
- whatsapp <SocialShare class="list-demo-sns" :networks="['whatsapp']"/>
- x <SocialShare class="list-demo-sns" :networks="['x']"/>

::: warning Note
There is no single, standard way in which browsers/email clients handle mailto links (e.g. subject and body fields may be discarded without a warning). Also there is a risk that popup and ad blockers, anti-virus software etc. may silently block forced opening of mailto links.

Mailto only launches the MUA(Mail User Agent) which is configured as the default in the system-settings.
:::

**Reference**:

- [Automatically open default email client and pre-populate content](https://stackoverflow.com/questions/13231125/automatically-open-default-email-client-and-pre-populate-content)
- [Open email client through javascript](https://stackoverflow.com/questions/22941457/open-email-client-through-javascript)

### twitterUser

- **type:** `string`
- **default** `undefined`

Your Twitter profile username.

### fallbackImage

- **type:** `string`
- **default** `undefined`

A fallback share image if the page has no share image specified.

You can provide a network image url or an absolute path resolve based on `.vuepress/public`.

```ts
import { defineUserConfig } from 'vuepress'
import { socialSharePlugin } from 'vuepress-plugin-social-share'

// Network image
export default defineUserConfig({
  plugins: [
    socialSharePlugin({
      fallbackImage: 'https://vuepress.vuejs.org/hero.png',
    }),
  ],
})
```

```ts
import { defineUserConfig } from 'vuepress'
import { socialSharePlugin } from 'vuepress-plugin-social-share'

// Public image file
export default defineUserConfig({
  plugins: [
    socialSharePlugin({
      fallbackImage: '/hero.png',
    }),
  ],
})
```

### autoQuote

- **type:** `boolean`
- **default** `true`

For Facebook, use the share meta [description](/guide/#description) as the share quote content.

### isPlain

- **type:** `boolean`
- **default** `false`

You can set `isPlain` to `true` if you don't like that all share icons have different colors.

All share icon colors will be set as the [--vp-c-accent](/guide/#custom-style) (former named `--c-brand`) by default.

Customize the color by setting [--c-social-share-plain](/guide/#custom-style).

### useCustomStyle

- **type:** `boolean`
- **default** `false`

You can disable the built-in style by setting `useCustomStyle` to `true`.

Then you can write styles that suit your theme.

You can take [built-in style](https://github.com/ntnyq/vuepress-plugin-social-share/tree/next/src/client/styles) as a reference.

### hideWhenPrint

- **type:** `boolean`
- **default** `false`

Hide all SocialShare (global as well) when print.

### qrcodeOptions

- **type:** `object`
- **default**: `{ errorCorrectionLevel: 'H', width: 250, scale: 1, margin: 1.5 }`

We use [qrcode](https://github.com/soldair/node-qrcode) to generate the qrcode image.

See it's [options](https://github.com/soldair/node-qrcode#qr-code-options) for more information.

### extendsNetworks <Badge type="danger" text="Deprecated" vertical="top" />

- **type:** `object`
- **default** `undefined`
- **deprecated**: `true`

With this option, you can add your custom sharer or override the [built-in networks config](https://github.com/ntnyq/vuepress-plugin-social-share/blob/master/lib/networks.json).

i.e:

```ts
import { defineUserConfig } from 'vuepress'
import { socialSharePlugin } from 'vuepress-plugin-social-share'
import type { SocialShareNetwork } from 'vuepress-plugin-social-share'

const extendsNetworks: Record<string, SocialShareNetwork> = {
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
    icon: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M910.336 0H113.664A114.005333 114.005333 0 0 0 0 113.664v796.672A114.005333 114.005333 0 0 0 113.664 1024h796.672A114.005333 114.005333 0 0 0 1024 910.336V113.664A114.005333 114.005333 0 0 0 910.336 0zM352.256 796.330667H207.189333V375.466667h145.066667z m-72.021333-477.866667a77.824 77.824 0 0 1-81.237334-74.069333A77.824 77.824 0 0 1 280.234667 170.666667a77.824 77.824 0 0 1 81.237333 73.728 77.824 77.824 0 0 1-81.237333 73.386666z m582.314666 477.866667H716.8v-227.669334c0-46.762667-18.432-93.525333-73.045333-93.525333a84.992 84.992 0 0 0-81.237334 94.549333v226.304h-140.629333V375.466667h141.653333v60.757333a155.989333 155.989333 0 0 1 136.533334-71.338667c60.416 0 163.498667 30.378667 163.498666 194.901334z" /></svg>',
  },
  twitter: {
    color: {
      light: '#1786b1',
      dark: '#ff0',
    },
  },
}

export default defineUserConfig({
  plugins: [
    socialSharePlugin({
      networks: ['twitter', 'facebook', 'email', 'pinterest', 'linkedin'],
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
- `direct` Open the sharer in current window directly. For `mailto:`, `sms:` and other built-in protocol
- `qrcode` Open a model to show the qrcode of current page

The plugin does nothing if you haven't config `type` properly.

#### color

- **type:** `string | { dark: string; light: string }`
- **default** `''`

Set the svg element color if you use it as sharer's icon.

#### icon

- **type:** `string | { dark: string; light: string }`
- **required** `true`

You can set `icon` with a **network image**, an **image in your public folder with an absolute path** or an **svg element**.

### noGlobalSocialShare

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

- `$frontmatter.shareTitle`

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

```scss
:root {
  // global trigger color
  --c-social-share-trigger: var(--c-text-lightest, #6a8bad);

  // plain mode icon color
  --c-social-share-plain: var(--c-brand, var(--vp-c-accent));

  // global bgColor
  --c-bg-global-social-share: var(--c-bg, var(--vp-c-bg));
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

## Migration from v1

- [New VuePress plugin API with better TypeScript support](#options)
- [Use CSS variables to custom plugin style](#custom-style)
- [Option `email` is deprecated, just remove it, see #71 for reasons](https://github.com/ntnyq/vuepress-plugin-social-share/pull/71)
- [Option `extendsNetworks` is deprecated, use `networks` instead](#networks)
