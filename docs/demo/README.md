---
sidebar: false
noGlobalSocialShare: true
---

# Demo

Some demos.

## Local mode

```vue
<social-share />
```

<social-share />

## Plain mode

```vue
<social-share
  :networks="['facebook', 'qq', 'twitter', 'line', 'reddit']"
  is-plain
/>
```

<social-share :networks="['facebook', 'qq', 'twitter', 'line', 'reddit']" is-plain />

## Custom hashtags

```vue
<social-share
  :networks="['twitter', 'facebook']"
  :tags="['SocialShare', 'VuePress']"
/>
```

<social-share :networks="['twitter', 'facebook']" :tags="['SocialShare', 'VuePress']" />

## Custom order

```vue
<social-share :networks="['twitter', 'facebook']" />

<social-share :networks="['facebook', 'twitter']" />
```

<social-share :networks="['twitter', 'facebook']" />

<social-share :networks="['facebook', 'twitter']" />

## Built-in networks

```vue
<social-share
  :networks="[
    'facebook',
    'qq',
    'twitter',
    'line',
    'reddit',
    'skype',
    'douban',
    'whatsapp',
    'telegram',
    'weibo',
  ]"
/>
```

<social-share :networks="['facebook', 'qq', 'twitter', 'line', 'reddit', 'skype', 'douban', 'whatsapp', 'telegram', 'weibo']" />

## User-customed networks

```vue
<social-share :networks="['pinterest', 'linkedin']" />
```

<social-share :networks="['pinterest', 'linkedin']" />

## No global UI

Add `noGlobalSocialShare: true` in **frontmatter** to disable the global ui component.

Currently, the page you are looking at has no global social share component.

```markdown
---
noGlobalSocialShare: true
---
```
