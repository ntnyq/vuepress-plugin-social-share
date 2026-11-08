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

```ts
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

### shareIcon

- **type:** `string | { dark: string; light: string }`
- **default** `undefined`

Share icon for `GlobalSocialShare` component.

### shareCloseIcon

- **type:** `string | { dark: string; light: string }`
- **default** `undefined`

Close share icon for `GlobalSocialShare` component.

## Component Props

The props of `SocialShare` component.

### networks

Same as the plugin's option [networks](/guide/#networks), but with a higher priority.

### tags

- **type:** `string[]`
- **default** `undefined`

Share tags for Twitter and Facebook.

When omitted, tags fall back to the page's keywords meta tag. Pass an empty array to disable this fallback.

### isPlain

Same as the plugin's option [isPlain](/guide/#isplain), but with a higher priority.

## Share meta

Meta data for social share services.

Each meta data are listed following its priority.

### url

- `$frontmatter.$shareUrl`

- `$frontmatter.shareUrl`

- `location.href`

The browser fallback is read when sharing starts, so it includes the current
query and fragment. Pages with a `permalink` use their actual browser URL,
including the site origin and base path.

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

## Page configuration

Override presentation for one page with frontmatter:

```yaml
socialShare:
  networks: [weibo, wechat, copy]
  isPlain: true
  hideWhenPrint: true
```

For `networks`, `isPlain`, and `hideWhenPrint`, priority is component props →
page `socialShare` → plugin options → built-in defaults. Explicit `false` and `[]`
are preserved. An empty list hides both inline sharing and the global trigger.
Names reference registered networks, retain their order, and are deduplicated.
Unknown names are skipped, with a development warning; an entirely unknown list
also hides the trigger. Route changes re-resolve these options.

`noSocialShare` and `noGlobalSocialShare` retain their disabling behavior.
Existing share metadata and tag priorities are unchanged. `hideWhenPrint` is also
available as a component prop.

## Locales

Messages support English and Simplified Chinese, chosen from the current page
language. Override individual fields with VuePress locale paths:

```ts
socialSharePlugin({
  locales: {
    '/': { copied: 'Link copied!' },
    '/zh/': {
      shareWith: '分享到 {network}',
      expand: '展开分享',
      collapse: '收起分享',
      networkLabels: { twitter: '推特' },
    },
  },
})
```

Fallback is current locale path → root path → built-in page language → English.
`networkLabels` merges by network name. `{network}` is plain text. Route changes
update labels and feedback. Other fields are `markdownCopied`, `copyFailed`,
`shareFailed`, `nativeShared`, `cancelled`, `qrcodeAlt`, and `qrcodeClose`. The global trigger
exposes `aria-expanded` and `aria-controls` alongside its translated label.

## Client hooks and events

Register callbacks in `.vuepress/client.ts`. They belong to the current Vue App
and can be configured before or after the plugin's own `enhance` hook:

```ts
import { configureSocialShare } from 'vuepress-plugin-social-share/client'
import { defineClientConfig } from 'vuepress/client'

export default defineClientConfig({
  enhance({ app }) {
    configureSocialShare(app, {
      beforeShare({ meta }) {
        if (meta.url.includes('/private/')) return false
        return { title: `${meta.title} | My site` }
      },
      onShareEvent(event) {
        console.log(event.status, event.network.name, event.meta.url)
      },
    })
  },
})
```

`beforeShare` is synchronous: return `false` to cancel, a partial metadata object
(`url`, `title`, `description`, `media`, `quote`, `hashtags`) to patch this action,
or nothing to continue. It receives read-only snapshots. Patches never change
frontmatter or future actions. Exceptions and Promise returns stop the action
and emit an error at stage `before-share`. Async pre-hooks are rejected by both
TypeScript and runtime checks to preserve browser user activation.

Listen locally with `<SocialShare @share-event="onShareEvent" />`. Both local
listeners and app callbacks may return a Promise; synchronous exceptions and
Promise rejections are logged separately and do not change the share result.
Local listeners retain Vue’s `.once` behavior and support multiple handlers. Events include `network`, final `meta`, and one of these statuses:

| Status       | Meaning                                                                           |
| ------------ | --------------------------------------------------------------------------------- |
| `opened`     | Browser returned a share window handle                                            |
| `displayed`  | QR code was appended to the page                                                  |
| `copied`     | Clipboard write completed                                                         |
| `handed-off` | System sharing Promise resolved                                                   |
| `cancelled`  | Pre-hook cancelled, or system sharing returned `AbortError`                       |
| `error`      | Action failed; includes original `error` and `stage` (`before-share` or `action`) |

These events do not prove the user published anything. Blocked windows emit an
error. Pending QR, clipboard and native results are discarded on route change or
unmount. QR failures also retain their existing console error report.

Only the latest QR request in the document may display its result. QR codes open
in a modal dialog with a localized close button. Escape or clicking the overlay
closes it and returns focus to the sharing button.

## Copy and system sharing

Opt in to these built-in networks; the default network list is unchanged:

```ts
socialSharePlugin({ networks: ['twitter', 'copy', 'copy-markdown', 'native'] })
```

- `copy` copies the final share URL.
- `copy-markdown` copies `[title](URL)`, escaping Markdown text and URL delimiters.
- `native` calls `navigator.share({ title, text: description, url })`.

Clipboard and system sharing require a secure context and browser support.
Unavailable native sharing is hidden after capability detection at mount, with
the same initial markup during SSR and hydration. Clipboard failure displays a
read-only text field for manual copying. Pending clipboard/native actions disable
buttons and ignore repeated clicks. Feedback is announced in a `role="status"`
region. A native `AbortError` means cancellation or no available target and never
silently copies instead.

Custom networks also support `type: 'clipboard'` with
`clipboardFormat: 'url' | 'markdown'` (default `url`), or `type: 'native'`.
Neither requires `sharer`; both still require an icon.

## Layout

```ts
socialSharePlugin({
  globalLayout: {
    position: 'left',
    direction: 'vertical',
    mobile: { position: 'bottom', direction: 'horizontal' },
  },
})
```

Positions are `left`, `right`, and `bottom`; directions are `horizontal` and
`vertical`. Mobile fields override the desktop fields below 768px. With no
configuration, the toolbar retains its right-side desktop and mobile placement.
Bottom positioning includes the device safe area. Long lists scroll within the
viewport. Inline components accept `<SocialShare direction="vertical" />`.

Customize dimensions with CSS variables. Unset size variables preserve the
existing desktop, global-toolbar, and mobile sizes:

```css
:root {
  --social-share-button-size: 3.5rem;
  --social-share-icon-size: 2rem;
  --social-share-gap: 0.25rem;
  --social-share-button-radius: 50%;
  --social-share-z-index: 99999;
  --social-share-offset-inline: 0.5rem;
  --social-share-offset-block: 50%;
  --social-share-mobile-offset-block: 15vh;
  --social-share-offset-bottom: 1rem;
}
```

The existing three color variables continue to work. With `useCustomStyle`,
components still output `data-direction`, `data-position`,
`data-mobile-direction`, and `data-mobile-position` for theme styles to consume.
