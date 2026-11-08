import { describe, expect, it, vi } from 'vitest'
import { computed, createSSRApp, h, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SocialShare } from '../src/client/components/SocialShare'
import { injectSocialShareOptions } from '../src/client/helpers'
import { BUILT_IN_NETWORKS } from '../src/shared'

vi.mock(import('@vuepress/helper/client'), () => ({
  useDarkMode: () => ref(false),
}))

vi.mock(import('vuepress/client'), () => ({
  usePageFrontmatter: () => computed(() => ({})),
  withBase: (url: string) => url,
}))

function renderSocialShare(networks?: string[]) {
  const app = createSSRApp({
    render: () => h(SocialShare, { networks }),
  })

  injectSocialShareOptions(app, {
    networksData: [
      { ...BUILT_IN_NETWORKS.twitter, name: 'twitter', default: true },
      { ...BUILT_IN_NETWORKS.reddit, name: 'reddit', default: true },
      { ...BUILT_IN_NETWORKS.wechat, name: 'wechat', default: false },
    ],
  })

  return renderToString(app)
}

describe('social share networks', () => {
  it('renders configured defaults when networks are omitted', async () => {
    const html = await renderSocialShare()

    expect(html).toContain('aria-label="Share with Twitter"')
    expect(html).toContain('aria-label="Share with Reddit"')
    expect(html).not.toContain('aria-label="Share with Wechat"')
  })

  it('uses explicitly provided networks in order without duplicates', async () => {
    const html = await renderSocialShare(['wechat', 'twitter', 'wechat'])

    expect(html).toContain('aria-label="Share with Wechat"')
    expect(html).not.toContain('aria-label="Share with Reddit"')
    expect(html.match(/aria-label="Share with Wechat"/gu)).toHaveLength(1)
    expect(html.indexOf('Share with Wechat')).toBeLessThan(
      html.indexOf('Share with Twitter'),
    )
  })

  it('renders nothing when networks are explicitly empty', async () => {
    const html = await renderSocialShare([])

    expect(html).not.toContain('social-share-list')
  })
})
