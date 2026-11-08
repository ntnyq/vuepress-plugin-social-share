// @vitest-environment happy-dom
// oxlint-disable vitest/no-hooks -- Every case needs isolated DOM and app cleanup.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, createApp, h, nextTick, ref } from 'vue'
import type { App } from 'vue'
import { usePageFrontmatter } from 'vuepress/client'
import { SocialShare } from '../src/client/components/SocialShare'
import { injectSocialShareOptions } from '../src/client/helpers'
import { getMetaContentByName } from '../src/client/utils'
import { BUILT_IN_NETWORKS } from '../src/shared'
import type {
  SocialShareFrontmatter,
  SocialShareNetworkWithName,
  SocialSharePluginOptionsWithDefaults,
} from '../src/shared'

const { renderQRCode } = vi.hoisted(() => ({
  renderQRCode: vi.fn<(...parameters: unknown[]) => Promise<string>>(),
}))

const frontmatter = ref<SocialShareFrontmatter>({})

vi.mock(import('qrcode'), async importOriginal => ({
  ...(await importOriginal()),
  toDataURL: renderQRCode,
}))
vi.mock(import('@vuepress/helper/client'), () => ({
  useDarkMode: () => ref(false),
}))
vi.mock(import('vuepress/client'), () => ({
  usePageFrontmatter: vi.fn<() => never>(() => {
    throw new Error('Frontmatter mock must be initialized before mounting')
  }),
  withBase: (url: string) => `/docs/${url.replace(/^\//u, '')}`,
}))

const apps = new Set<App>()
type SocialShareProps = InstanceType<typeof SocialShare>['$props']

function mountSocialShare(
  props: SocialShareProps = {},
  options: Partial<SocialSharePluginOptionsWithDefaults> = {},
) {
  const container = document.createElement('div')
  document.body.append(container)
  const app = createApp({
    render: () => h(SocialShare, { networks: ['twitter'], ...props }),
  })
  const networksData: SocialShareNetworkWithName[] = []
  for (const [name, network] of Object.entries(BUILT_IN_NETWORKS)) {
    networksData.push({
      ...network,
      name,
      default: name === 'twitter',
    })
  }
  injectSocialShareOptions(app, {
    networksData,
    ...options,
  })
  app.mount(container)
  apps.add(app)
  return {
    container,
    unmount: () => {
      app.unmount()
      apps.delete(app)
    },
  }
}

function getButton(container: HTMLElement) {
  const button = container.querySelector('button')
  if (!button) {
    throw new Error('Share button was not rendered')
  }
  return button
}

function share(container: HTMLElement) {
  getButton(container).click()
  expect(window.open).toHaveBeenCalledWith(
    expect.any(String),
    'sharer',
    expect.any(String),
  )
  return new URL(String(vi.mocked(window.open).mock.calls.at(-1)?.[0]))
}

function addMeta(name: string, content: string) {
  const meta = document.createElement('meta')
  meta.name = name
  meta.content = content
  document.head.append(meta)
}

describe('social share in the browser', () => {
  beforeEach(() => {
    frontmatter.value = {
      title: 'Share test',
      shareUrl: 'https://example.com/guide/',
    }
    vi.spyOn(window, 'open').mockReturnValue(null)
    vi.mocked(usePageFrontmatter).mockReturnValue(
      computed(() => frontmatter.value),
    )
    renderQRCode.mockReset().mockResolvedValue('data:image/png;base64,dGVzdA==')
  })

  afterEach(() => {
    for (const app of apps) {
      app.unmount()
    }
    apps.clear()
    document.body.replaceChildren()
    document.head.querySelectorAll('meta').forEach(meta => meta.remove())
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('share parameters', () => {
    it.each([
      ['pinterest', 'media'],
      ['weibo', 'pic'],
      ['qq', 'pics'],
      ['douban', 'image'],
    ])('preserves the complete image URL for %s', (network, parameter) => {
      const image =
        'https://cdn.example.com/image.png?w=1200&token=a%2Bb#preview'
      frontmatter.value.shareImage = image
      frontmatter.value.shareDescription = 'A description'
      const { container } = mountSocialShare({ networks: [network] })
      const url = share(container)

      expect(url.searchParams.get(parameter)).toBe(image)
      expect(url.searchParams.has('token')).toBe(false)
      expect(url.hash).toBe('')
    })

    it('preserves parameters following an image URL with a fragment', () => {
      frontmatter.value.shareImage = 'https://cdn.example.com/image.png#preview'
      frontmatter.value.shareDescription = 'A description'
      const { container } = mountSocialShare({ networks: ['pinterest'] })

      expect(share(container).searchParams.get('description')).toBe(
        'A description',
      )
    })

    it.each([
      {
        network: 'twitter',
        key: 'hashtags',
        tags: 'vue&url=https://wrong.example/#topic,中文',
        urls: ['https://example.com/guide/'],
      },
      {
        network: 'x',
        key: 'hashtags',
        tags: 'vue&url=https://wrong.example/#topic,中文',
        urls: ['https://example.com/guide/'],
      },
      {
        network: 'facebook',
        key: 'hashtag',
        tags: '#vue&url=https://wrong.example/#topic',
        urls: [],
      },
    ])(
      'encodes hashtags without adding parameters for $network',
      ({ network, key, tags, urls }) => {
        frontmatter.value.shareTags =
          'vue&url=https://wrong.example/#topic,中文'
        const { container } = mountSocialShare({ networks: [network] })
        const url = share(container)

        expect(url.searchParams.get(key)).toBe(tags)
        expect(url.searchParams.getAll('url')).toStrictEqual(urls)
        expect(url.hash).toBe('')
      },
    )

    it('keeps the Twitter username inside its own parameter', () => {
      const { container } = mountSocialShare(undefined, {
        twitterUser: 'author&url=https://wrong.example',
      })
      const url = share(container)

      expect(url.searchParams.get('via')).toBe(
        'author&url=https://wrong.example',
      )
      expect(url.searchParams.getAll('url')).toStrictEqual([
        'https://example.com/guide/',
      ])
    })
  })

  describe('share metadata', () => {
    it('reads meta content by name instead of matching an element name', () => {
      addMeta('description', 'Site description')
      const decoy = document.createElement('description')
      decoy.setAttribute('content', 'Wrong description')
      document.body.prepend(decoy)

      expect(getMetaContentByName('description')).toBe('Site description')
      expect(getMetaContentByName('missing')).toBe('')
    })

    it('falls back to description meta for the description and automatic quote', () => {
      addMeta('description', 'Site description & 中文')
      const { container } = mountSocialShare({ networks: ['facebook'] })
      const url = share(container)

      expect(url.searchParams.get('description')).toBe(
        'Site description & 中文',
      )
      expect(url.searchParams.get('quote')).toBe('Site description & 中文')
    })

    it('falls back to keywords when tags are omitted', () => {
      addMeta('keywords', 'vue, plugin')
      const { container } = mountSocialShare()

      expect(share(container).searchParams.get('hashtags')).toBe('vue,plugin')
    })

    it('allows explicit empty tags to disable the keywords fallback', () => {
      addMeta('keywords', 'vue,plugin')
      const { container } = mountSocialShare({
        networks: ['twitter'],
        tags: [],
      })

      expect(share(container).searchParams.has('hashtags')).toBe(false)
    })

    it('keeps frontmatter tags ahead of component tags and keywords', () => {
      addMeta('keywords', 'meta')
      frontmatter.value.shareTags = 'frontmatter'
      const { container } = mountSocialShare({
        networks: ['twitter'],
        tags: ['component'],
      })

      expect(share(container).searchParams.get('hashtags')).toBe('frontmatter')
    })
  })

  describe('plain mode overrides', () => {
    it.each([
      { global: true, local: undefined, plain: true },
      { global: true, local: false, plain: false },
      { global: false, local: true, plain: true },
      { global: false, local: undefined, plain: false },
    ])('uses global=$global, local=$local', ({ global, local, plain }) => {
      const { container } = mountSocialShare(
        { networks: ['twitter'], isPlain: local },
        { isPlain: global },
      )
      const icon = container.querySelector<HTMLElement>(
        '.social-share-icon-svg',
      )

      expect(icon).not.toBeNull()
      expect(icon?.style.color === '').toBe(plain)
    })
  })

  describe('popup resources', () => {
    it('leaves no timers after repeated sharing and unmounting', () => {
      vi.useFakeTimers()
      vi.spyOn(window, 'focus').mockImplementation(() => {})
      vi.mocked(window.open).mockReturnValue(window)
      const { container, unmount } = mountSocialShare()

      getButton(container).click()
      getButton(container).click()
      expect(window.focus).toHaveBeenCalledTimes(2)
      unmount()

      expect(vi.getTimerCount()).toBe(0)
    })

    it('leaves no polling timers when the popup is blocked', () => {
      vi.useFakeTimers()
      const { container } = mountSocialShare()

      getButton(container).click()

      expect(vi.getTimerCount()).toBe(0)
    })
  })

  describe('qr code lifecycle', () => {
    it('renders a single overlay for rapid clicks and closes it on click', async () => {
      const { container } = mountSocialShare({ networks: ['qrcode'] })
      getButton(container).click()
      getButton(container).click()
      await vi.dynamicImportSettled()

      expect(document.querySelectorAll('.social-share-overlay')).toHaveLength(1)
      expect(renderQRCode).toHaveBeenCalledWith(
        'https://example.com/guide/',
        expect.objectContaining({ errorCorrectionLevel: 'H', width: 250 }),
      )
      document.querySelector<HTMLElement>('.social-share-overlay')?.click()

      expect(document.querySelector('.social-share-overlay')).toBeNull()
    })

    it('ignores an older result when requests finish out of order', async () => {
      const first = Promise.withResolvers<string>()
      const second = Promise.withResolvers<string>()
      renderQRCode
        .mockReturnValueOnce(first.promise)
        .mockReturnValueOnce(second.promise)
      const { container } = mountSocialShare({ networks: ['qrcode'] })
      getButton(container).click()
      await vi.dynamicImportSettled()
      getButton(container).click()
      await vi.dynamicImportSettled()
      expect(renderQRCode).toHaveBeenCalledTimes(2)

      second.resolve('data:image/png;base64,bmV3')
      await vi.dynamicImportSettled()
      first.resolve('data:image/png;base64,b2xk')
      await vi.dynamicImportSettled()

      expect(document.querySelectorAll('.social-share-overlay')).toHaveLength(1)
      expect(document.querySelector('img')?.src).toBe(
        'data:image/png;base64,bmV3',
      )
    })

    it('removes a visible overlay when the component unmounts', async () => {
      const { container, unmount } = mountSocialShare({ networks: ['qrcode'] })
      getButton(container).click()
      await vi.dynamicImportSettled()
      expect(document.querySelector('.social-share-overlay')).not.toBeNull()

      unmount()

      expect(document.querySelector('.social-share-overlay')).toBeNull()
    })

    it('does not append a pending result after unmounting', async () => {
      const pending = Promise.withResolvers<string>()
      renderQRCode.mockReturnValueOnce(pending.promise)
      const { container, unmount } = mountSocialShare({ networks: ['qrcode'] })
      getButton(container).click()
      await vi.dynamicImportSettled()
      expect(renderQRCode).toHaveBeenCalledWith(
        'https://example.com/guide/',
        expect.any(Object),
      )

      unmount()
      pending.resolve('data:image/png;base64,dGVzdA==')
      await vi.dynamicImportSettled()

      expect(document.querySelector('.social-share-overlay')).toBeNull()
    })

    it('cancels rendering when unmounted before the QR module loads', async () => {
      const { container, unmount } = mountSocialShare({ networks: ['qrcode'] })
      getButton(container).click()
      unmount()
      await vi.dynamicImportSettled()

      expect(renderQRCode).not.toHaveBeenCalled()
      expect(document.querySelector('.social-share-overlay')).toBeNull()
    })

    it('keeps only one overlay across independent components', async () => {
      const first = mountSocialShare({ networks: ['qrcode'] })
      const second = mountSocialShare({ networks: ['wechat'] })
      getButton(first.container).click()
      await vi.dynamicImportSettled()
      getButton(second.container).click()
      await vi.dynamicImportSettled()

      expect(document.querySelectorAll('.social-share-overlay')).toHaveLength(1)
      first.unmount()
      expect(document.querySelectorAll('.social-share-overlay')).toHaveLength(1)
      second.unmount()
      expect(document.querySelector('.social-share-overlay')).toBeNull()
    })

    it('reports rendering failures without leaving an overlay', async () => {
      const error = new Error('QR generation failed')
      renderQRCode.mockRejectedValueOnce(error)
      const logError = vi.spyOn(console, 'error').mockImplementation(() => {})
      const { container } = mountSocialShare({ networks: ['qrcode'] })
      getButton(container).click()
      await vi.dynamicImportSettled()
      await nextTick()

      expect(logError).toHaveBeenCalledWith(
        'Failed to generate QR code:',
        error,
      )
      expect(document.querySelector('.social-share-overlay')).toBeNull()
    })
  })
})
