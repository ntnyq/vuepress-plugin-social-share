import { describe, expect, it, vi } from 'vitest'
import { computed, createSSRApp, h, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { GlobalSocialShare } from '../src/client/components/GlobalSocialShare'
import { SocialShare } from '../src/client/components/SocialShare'
import { injectSocialShareOptions } from '../src/client/helpers'
import { BUILT_IN_NETWORKS } from '../src/shared'
import type { SocialShareVariant } from '../src/shared'

vi.mock(import('@vuepress/helper/client'), () => ({
  useDarkMode: () => ref(false),
}))

vi.mock(import('vuepress/client'), () => ({
  usePageLang: () => computed(() => 'en'),
  useRouteLocale: () => computed(() => '/'),
  useRoute: () => ({
    fullPath: '/',
    path: '/',
    name: undefined,
    params: {},
    query: {},
    hash: '',
    matched: [],
    meta: {},
    redirectedFrom: undefined,
  }),
  usePageFrontmatter: () => computed(() => ({})),
  withBase: (url: string) => url,
}))

function renderSocialShare(networks?: string[], variant?: SocialShareVariant) {
  const app = createSSRApp({
    render: () => h(SocialShare, { networks, variant }),
  })

  injectSocialShareOptions(app, {
    networksData: [
      { ...BUILT_IN_NETWORKS.twitter, name: 'twitter', default: true },
      { ...BUILT_IN_NETWORKS.reddit, name: 'reddit', default: true },
      { ...BUILT_IN_NETWORKS.wechat, name: 'wechat', default: false },
      { ...BUILT_IN_NETWORKS.copy, name: 'copy' },
      { ...BUILT_IN_NETWORKS.native, name: 'native' },
    ],
  })

  return renderToString(app)
}

describe('social share networks', () => {
  it('renders the labeled panel safely on the server without native sharing', async () => {
    const html = await renderSocialShare(['copy', 'native', 'wechat'], 'panel')
    expect(html).toContain('social-share-quick-actions')
    expect(html).toContain('social-share-platform-grid')
    expect(html).toContain('social-share-label')
    expect(html).not.toContain('System share')
  })

  it.each(['toolbar', 'panel'] as const)(
    'renders a collapsed global %s without browser APIs',
    async variant => {
      const app = createSSRApp({ render: () => h(GlobalSocialShare) })
      injectSocialShareOptions(app, {
        networksData: [
          { ...BUILT_IN_NETWORKS.twitter, name: 'twitter', default: true },
        ],
        globalLayout: { variant },
      })
      const html = await renderToString(app)
      expect(html).toContain(`data-variant="${variant}"`)
      expect(html).toContain('aria-expanded="false"')
      expect(html).not.toContain('role="dialog"')
    },
  )

  it('renders copying safely in SSR and defers native support detection', async () => {
    const html = await renderSocialShare(['copy', 'native'])
    expect(html).toContain('Share with Copy link')
    expect(html).not.toContain('System share')
  })

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
