---
sidebar: false
socialShare:
  variant: default
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
    variant: toolbar
    position: right
    direction: vertical
    mobile:
      position: bottom
      direction: horizontal
---

# Original floating toolbar

The original expandable strip remains available. Open it at the right edge on
desktop, or at the bottom on mobile. Long lists scroll inside the toolbar.

## Share this page

<SocialShare />

## Page configuration

```yaml
---
socialShare:
  variant: default
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
    variant: toolbar
    position: right
    direction: vertical
    mobile:
      position: bottom
      direction: horizontal
---
```

With no appearance configuration, the plugin continues to use the original icons
and toolbar. The mobile bottom position on this page is an explicit override.

[Compare the independent panel](./panel.md) or [see all inline examples](./).
