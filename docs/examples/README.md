---
sidebar: false
noGlobalSocialShare: true
---

# Examples

Usage examples.

## Default mode

```vue
<SocialShare />
```

<SocialShare />

## Plain mode

<!-- prettier-ignore-start -->

```vue
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
