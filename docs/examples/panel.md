---
sidebar: false
socialShare:
  variant: compact
  networks:
    - copy
    - copy-markdown
    - native
    - wechat
    - qq
    - weibo
    - x
    - facebook
    - linkedin
    - email
    - reddit
  globalLayout:
    variant: panel
    position: right
    mobile:
      position: right
---

# Independent share panel

Use the sharing button at the bottom right to open the panel. Its launcher stays
in place while you share, copy a link, or close the panel. Press Escape, click
outside, or use the close button to dismiss it.

Clipboard and system sharing appear above the platform grid. Only configured
networks are included; system sharing requires browser support. Try copying a
link to see feedback in the panel. Switch the site color mode to preview both
themes, or narrow your viewport to check the mobile layout.

## Share this page

This inline component inherits `variant: compact` from this page:

<SocialShare />

```vue
<SocialShare />
```

## Page configuration

The site's default toolbar is unchanged. This page opts into the panel and compact
inline buttons through its frontmatter:

```yaml
---
socialShare:
  variant: compact
  networks:
    [
      copy,
      copy-markdown,
      native,
      wechat,
      qq,
      weibo,
      x,
      facebook,
      linkedin,
      email,
      reddit,
    ]
  globalLayout:
    variant: panel
    position: right
    mobile:
      position: right
---
```

## Component overrides

An explicit component prop takes precedence over the page's inline presentation.
This is the original inline style on the same page:

<SocialShare variant="default" :networks="['wechat', 'qq', 'weibo', 'x', 'facebook']" />

```vue
<SocialShare
  variant="default"
  :networks="['wechat', 'qq', 'weibo', 'x', 'facebook']"
/>
```

[Compare the original floating toolbar](./toolbar.md) or
[read the appearance options](/guide/#appearance).
