---
sidebar: false
noGlobalSocialShare: true
---

# Demo

Some demos.

## Local mode

``` vue
<social-share />
```
<social-share />

## Plain mode

``` vue
<social-share is-plain />
```

<social-share is-plain />

## Custom hashtags

``` vue
<social-share 
  :networks="['twitter', 'facebook']" 
  :tags="['SocialShare', 'VuePress']" 
/>
```

<social-share :networks="['twitter', 'facebook']" :tags="['SocialShare', 'VuePress']" />

## Custom networks

``` vue
<social-share 
  :networks="['facebook', 'qq', 'twitter', 'line', 'reddit', 'skype', 'douban', 'whatsapp', 'telegram', 'weibo']" 
/>
```

<social-share :networks="['facebook', 'qq', 'twitter', 'line', 'reddit', 'skype', 'douban', 'whatsapp', 'telegram', 'weibo']" />

## No global UI

Add `noGlobalSocialShare: true` in **frontmatter** to disable the global ui component.

Currently, the page you are looking at has no global social share component.

``` markdown
---
noGlobalSocialShare: true
---
```
