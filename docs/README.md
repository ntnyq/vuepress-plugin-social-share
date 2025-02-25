---
home: true
title: home
actions:
  - text: Get Started
    link: /guide/
    type: primary
footer: MIT Licensed | Copyright © 2019-present ntnyq
pageClass: page-home
shareDescription: A VuePress plugin which provides social sharing services
shareImage: /hero.png
tags: VuePress, plugin, SocialShare
---

<SocialShare 
  class="social-share-home"
  :networks="[
    'qrcode', 
    'wechat', 
    'qq', 
    'twitter', 
    'facebook', 
    'weibo', 
    'email', 
    'pinterest'
  ]"
/>
