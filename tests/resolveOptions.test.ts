import { describe, expect, it } from 'vitest'
import { resolveSocialShareOptions } from '../src/client/helpers/resolveOptions'
import type { SocialSharePluginOptionsWithDefaults } from '../src/shared'
import { BUILT_IN_NETWORKS } from '../src/shared'

const options: SocialSharePluginOptionsWithDefaults = {
  isPlain: true,
  hideWhenPrint: true,
  networksData: [
    { ...BUILT_IN_NETWORKS.twitter, name: 'twitter', default: true },
    { ...BUILT_IN_NETWORKS.wechat, name: 'wechat' },
  ],
}

describe('page configuration', () => {
  it('resolves appearance from props, page, plugin and the legacy default', () => {
    const plugin = { ...options, variant: 'compact' } as const
    expect(resolveSocialShareOptions(options).variant).toBe('default')
    expect(resolveSocialShareOptions(plugin).variant).toBe('compact')
    expect(
      resolveSocialShareOptions(plugin, { variant: 'panel' }).variant,
    ).toBe('panel')
    expect(
      resolveSocialShareOptions(
        plugin,
        { variant: 'panel' },
        { variant: 'default' },
      ).variant,
    ).toBe('default')
  })

  it('uses props before page options and preserves false and empty lists', () => {
    const resolved = resolveSocialShareOptions(
      options,
      { networks: ['wechat'], isPlain: true, hideWhenPrint: true },
      { networks: [], isPlain: false, hideWhenPrint: false },
    )
    expect(resolved.networks).toStrictEqual([])
    expect(resolved.isPlain).toBe(false)
    expect(resolved.hideWhenPrint).toBe(false)
  })

  it('orders and deduplicates registered names and reports unknown ones', () => {
    const resolved = resolveSocialShareOptions(options, {
      networks: ['wechat', 'unknown', 'twitter', 'wechat'],
      isPlain: false,
    })
    expect(resolved.networks.map(network => network.name)).toStrictEqual([
      'wechat',
      'twitter',
    ])
    expect(resolved.unknownNetworks).toStrictEqual(['unknown'])
    expect(resolved.isPlain).toBe(false)
    expect(resolved.hideWhenPrint).toBe(true)
    expect(options.networksData[0].default).toBe(true)
  })

  it('falls back to plugin defaults', () => {
    expect(
      resolveSocialShareOptions(options).networks.map(network => network.name),
    ).toStrictEqual(['twitter'])
    expect(
      resolveSocialShareOptions(options, { networks: ['missing'] }).networks,
    ).toStrictEqual([])
  })
})
