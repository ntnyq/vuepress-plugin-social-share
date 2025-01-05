---
sidebar: false
noGlobalSocialShare: true
---

# Demo

Some demos.

## Local mode

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
    'qq',
    'telegram',
    'twitter',
    'reddit',
    'skype',
    'whatsapp',
    'weibo',
    'x',
  ]"
/>
```

<SocialShare 
  :networks="[
    'bluesky', 
    'douban', 
    'facebook', 
    'line', 
    'qq', 
    'telegram', 
    'twitter', 
    'reddit', 
    'skype', 
    'whatsapp', 
    'weibo',
    'x',
  ]" 
/>

## User-customed networks

```vue
<SocialShare :networks="['pinterest', 'linkedin']" />
```

<SocialShare :networks="['pinterest', 'linkedin']" />

## No global UI

Add `noGlobalSocialShare: true` in **frontmatter** to disable the global ui component.

Currently, the page you are looking at has no global social share component.

```md
---
noGlobalSocialShare: true
---
```
