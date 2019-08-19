---
sidebar: false
noSocialShare: true
---

# Demo

Some demos.

## Local mode

``` vue
<social-share :is-global="false" />
```
<social-share :is-global="false" />

## Plain mode

``` vue
<social-share :is-global="false" is-plain />
```

<social-share :is-global="false" is-plain />

## Custom hashtags

``` vue
<social-share 
  :networks="['twitter', 'facebook']" 
  :tags="['SocialShare', 'VuePress']" 
  :is-global="false" 
/>
```

<social-share :networks="['twitter', 'facebook']" :tags="['SocialShare', 'VuePress']" :is-global="false" />

## Custom networks

``` vue
<social-share 
  :networks="['facebook', 'qq', 'twitter', 'line', 'reddit', 'skype', 'douban', 'whatsapp', 'telegram', 'weibo']" 
  :is-global="false"
/>
```

<social-share :networks="['facebook', 'qq', 'twitter', 'line', 'reddit', 'skype', 'douban', 'whatsapp', 'telegram', 'weibo']" :is-global="false"/>

## No global UI

Add `noSocialShare: true` in **frontmatter** to disable the global ui component.

Currently, the page you are looking at has no global social share component.

``` markdown
---
noSocialShare: true
---
```
