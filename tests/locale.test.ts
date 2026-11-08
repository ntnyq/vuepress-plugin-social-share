import { describe, expect, it } from 'vitest'
import { resolveSocialShareLocale } from '../src/client/helpers/resolveLocale'

describe('locale resolution', () => {
  it('treats undefined overrides as missing and supports script subtags', () => {
    const locale = resolveSocialShareLocale(
      { '/': { expand: undefined }, '/zh/': { copied: undefined } },
      '/zh/',
      'zh-Hans-CN',
    )
    expect(locale.expand).toBe('展开分享')
    expect(locale.copied).toBe('链接已复制')
  })

  it('uses page language and falls back to English', () => {
    expect(resolveSocialShareLocale({}, '/', 'zh-CN').expand).toBe('展开分享')
    expect(resolveSocialShareLocale({}, '/', 'fr').expand).toBe(
      'Show sharing options',
    )
  })

  it('merges messages and labels by field through current and root locales', () => {
    const locale = resolveSocialShareLocale(
      {
        '/': {
          copied: 'Root copied',
          expand: 'Root expand',
          networkLabels: { twitter: 'Root Twitter' },
        },
        '/zh/': { expand: '展开', networkLabels: { wechat: '微信' } },
      },
      '/zh/',
      'zh-CN',
    )
    expect(locale.expand).toBe('展开')
    expect(locale.copied).toBe('Root copied')
    expect(locale.collapse).toBe('收起分享')
    expect(locale.networkLabels).toMatchObject({
      twitter: 'Root Twitter',
      wechat: '微信',
      copy: '复制链接',
    })
  })
})
