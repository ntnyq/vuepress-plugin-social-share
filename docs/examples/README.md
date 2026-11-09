---
sidebar: false
noGlobalSocialShare: true
---

# Examples

Usage examples.

- [Independent panel and compact inline buttons](./panel.md)
- [Original floating toolbar](./toolbar.md)

These pages select their appearance through frontmatter, using the same plugin
configuration.

## Default mode

```vue
<SocialShare />
```

<SocialShare />

## Plain mode

<!-- prettier-ignore-start -->

```vue
<SocialShare
  :networks="['facebook', 'qq', 'twitter', 'line', 'reddit']"
  is-plain
/>
```

<SocialShare 
  :networks="[
    'facebook', 
    'qq', 
    'twitter', 
    'line', 
    'reddit',
  ]" 
  is-plain 
/>

<!-- prettier-ignore-end -->

## Custom hashtags

<!-- prettier-ignore-start -->

```vue
<SocialShare
  :networks="['twitter', 'facebook']"
  :tags="['SocialShare', 'VuePress']"
/>
```

<SocialShare 
  :networks="['twitter', 'facebook']" 
  :tags="['SocialShare', 'VuePress']"
/>

<!-- prettier-ignore-end -->

## Custom order

```vue
<SocialShare :networks="['twitter', 'facebook']" />

<SocialShare :networks="['facebook', 'twitter']" />
```

<SocialShare :networks="['twitter', 'facebook']" />

<SocialShare :networks="['facebook', 'twitter']" />

## Built-in networks

```vue
<SocialShare
  :networks="[
    'bluesky',
    'douban',
    'email',
    'facebook',
    'line',
    'linkedin',
    'pinterest',
    'qq',
    'qrcode',
    'reddit',
    'skype',
    'telegram',
    'threads',
    'twitter',
    'viber',
    'wechat',
    'weibo',
    'whatsapp',
    'x',
  ]"
/>
```

<SocialShare 
  :networks="[
    'bluesky',
    'douban',
    'email',
    'facebook',
    'line',
    'linkedin',
    'pinterest',
    'qq',
    'qrcode',
    'reddit',
    'skype',
    'telegram',
    'threads',
    'twitter',
    'viber',
    'wechat',
    'weibo',
    'whatsapp',
    'x',
  ]" 
/>

## User defined networks

```vue
<SocialShare :networks="['pocket']" />
```

<SocialShare :networks="['pocket']" />

## No global UI

Add `noGlobalSocialShare: true` in **frontmatter** to disable the global ui component.

Currently, the page you are looking at has no global social share component.

```md
---
noGlobalSocialShare: true
---
```

## Copy and system sharing

<SocialShare :networks="['copy', 'copy-markdown', 'native', 'qrcode']" />

```vue
<SocialShare :networks="['copy', 'copy-markdown', 'native', 'qrcode']" />
```

The system share button is shown only in supported browsers. Failed clipboard
writes offer text for manual copying.

## Vertical layout

<SocialShare direction="vertical" :networks="['twitter', 'wechat', 'copy']" />

```vue
<SocialShare direction="vertical" :networks="['twitter', 'wechat', 'copy']" />
```

Configure floating-toolbar positions and mobile direction with the
[`globalLayout` option](/guide/#layout).

## Compact inline buttons

<SocialShare variant="compact" :networks="['copy', 'wechat', 'qq', 'weibo', 'x', 'facebook']" />

```vue
<SocialShare
  variant="compact"
  :networks="['copy', 'wechat', 'qq', 'weibo', 'x', 'facebook']"
/>
```

## Labeled action grid

<SocialShare variant="panel" :networks="['copy', 'copy-markdown', 'native', 'wechat', 'qq', 'weibo', 'x', 'facebook', 'linkedin', 'email', 'reddit']" />

```vue
<SocialShare
  variant="panel"
  :networks="[
    'copy',
    'copy-markdown',
    'native',
    'wechat',
    'qq',
    'weibo',
    'x',
    'facebook',
    'linkedin',
    'email',
    'reddit',
  ]"
/>
```
