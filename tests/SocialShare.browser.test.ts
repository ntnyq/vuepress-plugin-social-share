// @vitest-environment happy-dom
// oxlint-disable vitest/no-hooks -- Every case needs isolated DOM and app cleanup.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  computed,
  createApp,
  createSSRApp,
  h,
  mergeProps,
  nextTick,
  reactive,
  ref,
} from 'vue'
import type { App } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { usePageFrontmatter } from 'vuepress/client'
import { GlobalSocialShare } from '../src/client/components/GlobalSocialShare'
import { SocialShare } from '../src/client/components/SocialShare'
import {
  configureSocialShare,
  injectSocialShareOptions,
} from '../src/client/helpers'
import { getMetaContentByName } from '../src/client/utils'
import { BUILT_IN_NETWORKS } from '../src/shared'
import type {
  SocialShareClientOptions,
  SocialShareEvent,
  SocialShareFrontmatter,
  SocialShareNetworkWithName,
  SocialSharePluginOptionsWithDefaults,
} from '../src/shared'

const { renderQRCode } = vi.hoisted(() => ({
  renderQRCode: vi.fn<(...parameters: unknown[]) => Promise<string>>(),
}))

const frontmatter = ref<SocialShareFrontmatter>({})
const darkMode = ref(false)
const pageLang = ref('en')
const routeLocale = ref('/')
const route = reactive({
  fullPath: '/guide/',
  path: '/guide/',
  name: undefined,
  params: {},
  query: {},
  hash: '',
  matched: [],
  meta: {},
  redirectedFrom: undefined,
})

vi.mock(import('qrcode'), async importOriginal => ({
  ...(await importOriginal()),
  toDataURL: renderQRCode,
}))
vi.mock(import('@vuepress/helper/client'), () => ({
  useDarkMode: () => darkMode,
}))
vi.mock(import('vuepress/client'), () => ({
  usePageLang: () => computed(() => pageLang.value),
  useRouteLocale: () => computed(() => routeLocale.value),
  useRoute: () => route,
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
  hooks: SocialShareClientOptions & { global?: boolean } = {},
) {
  const container = document.createElement('div')
  document.body.append(container)
  const app = createApp({
    render: () =>
      hooks.global
        ? h(GlobalSocialShare)
        : h(SocialShare, { networks: ['twitter'], ...props }),
  })
  const networksData: SocialShareNetworkWithName[] = []
  for (const [name, network] of Object.entries(BUILT_IN_NETWORKS)) {
    networksData.push({
      ...network,
      name,
      default: name === 'twitter',
    })
  }
  configureSocialShare(app, hooks)
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

function createSharingSSRApp() {
  const app = createSSRApp({
    render: () => h(SocialShare, { networks: ['x'] }),
  })
  injectSocialShareOptions(app, {
    networksData: [{ ...BUILT_IN_NETWORKS.x, name: 'x', default: true }],
  })
  configureSocialShare(app, {})
  return app
}

function getElement<ElementType extends HTMLElement>(
  container: HTMLElement,
  selector: string,
) {
  const element = container.querySelector<ElementType>(selector)
  if (!element) {
    throw new Error(`Missing sharing element: ${selector}`)
  }
  return element
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

function mockMissingNavigatorProperty(property: keyof Navigator) {
  vi.stubGlobal(
    'navigator',
    new Proxy(navigator, {
      get: (target, key) =>
        key === property ? undefined : Reflect.get(target, key, target),
    }),
  )
}

function mockClipboard() {
  vi.stubGlobal('isSecureContext', true)
  const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue()
  vi.spyOn(navigator, 'clipboard', 'get').mockReturnValue({
    ...navigator.clipboard,
    writeText,
  })
  return writeText
}

function mockNativeShare() {
  const share = vi.fn<(data?: ShareData) => Promise<void>>().mockResolvedValue()
  vi.stubGlobal(
    'navigator',
    new Proxy(navigator, {
      get: (target, key) =>
        key === 'share' ? share : Reflect.get(target, key, target),
    }),
  )
  return share
}

describe('social sharing browser integration', () => {
  beforeEach(() => {
    darkMode.value = false
    pageLang.value = 'en'
    routeLocale.value = '/'
    route.fullPath = '/guide/'
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
    vi.unstubAllGlobals()
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
    it.each(['copy', 'qrcode', 'twitter'])(
      'shares the absolute browser permalink through %s',
      async network => {
        const currentURL =
          'https://example.com/docs/articles/custom/?lang=en#intro'
        vi.stubGlobal('location', {
          href: currentURL,
          origin: 'https://example.com',
        })
        frontmatter.value = { title: 'Article', permalink: '/articles/custom/' }
        mockClipboard()
        vi.mocked(window.open).mockReturnValue(window)
        vi.spyOn(window, 'focus').mockImplementation(() => {})
        const onShareEvent = vi.fn<(event: SocialShareEvent) => void>()
        const { container } = mountSocialShare(
          { networks: [network] },
          {},
          { onShareEvent },
        )

        getButton(container).click()
        await vi.dynamicImportSettled()

        expect(onShareEvent).toHaveBeenCalledExactlyOnceWith(
          expect.objectContaining({
            meta: expect.objectContaining({ url: currentURL }),
          }),
        )
      },
    )

    it('reads current browser metadata after same-page navigation and head updates', () => {
      const location = {
        href: 'https://example.com/guide/#first',
        origin: 'https://example.com',
      }
      vi.stubGlobal('location', location)
      vi.mocked(window.open).mockReturnValue(window)
      vi.spyOn(window, 'focus').mockImplementation(() => {})
      frontmatter.value = {}
      addMeta('description', 'Old description')
      addMeta('keywords', 'old')
      const { container } = mountSocialShare({ networks: ['facebook'] })
      share(container)

      location.href = 'https://example.com/guide/?mode=full#second'
      vi.spyOn(document, 'title', 'get').mockReturnValue('Updated title')
      document.head
        .querySelector('meta[name="description"]')
        ?.setAttribute('content', 'Updated description')
      document.head
        .querySelector('meta[name="keywords"]')
        ?.setAttribute('content', 'updated')
      const url = share(container)

      expect(url.searchParams.get('u')).toBe(location.href)
      expect(url.searchParams.get('title')).toBe('Updated title')
      expect(url.searchParams.get('description')).toBe('Updated description')
      expect(url.searchParams.get('quote')).toBe('Updated description')
      expect(url.searchParams.get('hashtag')).toBe('#updated')
    })

    it('exposes share actions as buttons in a native list', () => {
      const { container } = mountSocialShare({ networks: ['copy', 'twitter'] })

      expect(container.querySelector('ul')?.getAttribute('role')).toBeNull()
      expect(container.querySelector('[role="option"]')).toBeNull()
      expect(container.querySelectorAll('li > button')).toHaveLength(2)
    })

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
    it.each([
      {
        method: 'button',
        dismiss: (dialog: HTMLDialogElement) =>
          dialog.querySelector('button')?.click(),
      },
      {
        method: 'cancel',
        dismiss: (dialog: HTMLDialogElement) =>
          dialog.dispatchEvent(new Event('cancel', { cancelable: true })),
      },
    ])(
      'closes the modal with $method and restores focus to its trigger',
      async ({ dismiss }) => {
        pageLang.value = 'zh-CN'
        const { container } = mountSocialShare({ networks: ['qrcode'] })
        const trigger = getButton(container)
        trigger.focus()
        trigger.click()
        await vi.dynamicImportSettled()

        const dialog = document.querySelector<HTMLDialogElement>(
          'dialog[aria-modal="true"]',
        )!
        const closeButton = dialog?.querySelector('button')
        expect(dialog?.hasAttribute('open')).toBe(true)
        expect(closeButton?.textContent).toBe('关闭二维码')
        expect(document.activeElement).toBe(closeButton)

        dismiss(dialog)

        expect(document.querySelector('.social-share-overlay')).toBeNull()
        expect(document.activeElement).toBe(trigger)
      },
    )

    it('ignores older QR results from another component, even after dismissing the newer modal', async () => {
      const older = Promise.withResolvers<string>()
      renderQRCode.mockReturnValueOnce(older.promise)
      const oldEvents = vi.fn<(event: SocialShareEvent) => void>()
      const first = mountSocialShare(
        { networks: ['qrcode'] },
        {},
        { onShareEvent: oldEvents },
      )
      const second = mountSocialShare({ networks: ['wechat'] })
      getButton(first.container).click()
      await vi.dynamicImportSettled()
      getButton(second.container).click()
      await vi.dynamicImportSettled()
      document.querySelector<HTMLElement>('.social-share-qrcode-close')?.click()

      older.resolve('data:image/png;base64,b2xk')
      await vi.dynamicImportSettled()

      expect(document.querySelector('.social-share-overlay')).toBeNull()
      expect(oldEvents).not.toHaveBeenCalled()
    })

    it('preserves the newer QR result when an older component finishes or unmounts', async () => {
      const older = Promise.withResolvers<string>()
      const newer = Promise.withResolvers<string>()
      renderQRCode
        .mockReturnValueOnce(older.promise)
        .mockReturnValueOnce(newer.promise)
      const first = mountSocialShare({ networks: ['qrcode'] })
      const second = mountSocialShare({ networks: ['wechat'] })
      getButton(first.container).click()
      await vi.dynamicImportSettled()
      getButton(second.container).click()
      await vi.dynamicImportSettled()

      newer.resolve('data:image/png;base64,bmV3')
      await vi.dynamicImportSettled()
      older.resolve('data:image/png;base64,b2xk')
      await vi.dynamicImportSettled()
      first.unmount()

      expect(
        document.querySelector('.social-share-qrcode')?.getAttribute('src'),
      ).toBe('data:image/png;base64,bmV3')
    })

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

  describe('page options and locale routing', () => {
    it('updates inline options and labels when the route changes', async () => {
      const { container } = mountSocialShare({ networks: undefined })
      expect(getButton(container).title).toBe('Twitter')
      frontmatter.value = {
        socialShare: {
          networks: ['wechat'],
          isPlain: true,
          hideWhenPrint: true,
        },
      }
      pageLang.value = 'zh-CN'
      routeLocale.value = '/zh/'
      await nextTick()
      expect(getButton(container).getAttribute('aria-label')).toBe(
        '分享到 Wechat',
      )
      expect(
        container.querySelector('.social-share-hide-when-print'),
      ).not.toBeNull()
      expect(
        container.querySelector<HTMLElement>('.social-share-icon-svg')?.style
          .color,
      ).toBe('')
      frontmatter.value = { socialShare: { networks: [] } }
      await nextTick()
      expect(container.querySelector('button')).toBeNull()
    })

    it('keeps labels as text and merges locale network labels', () => {
      const { container } = mountSocialShare(
        {},
        {
          locales: { '/': { networkLabels: { twitter: '<b>Custom</b>' } } },
        },
      )
      expect(getButton(container).getAttribute('aria-label')).toBe(
        'Share with <b>Custom</b>',
      )
      expect(getButton(container).querySelector('b')).toBeNull()
    })

    it('hides global sharing for empty, invalid and disabled pages', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const { container } = mountSocialShare({}, {}, { global: true })
      const trigger = getButton(container)
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      const panelId = trigger.getAttribute('aria-controls')
      trigger.click()
      await nextTick()
      expect(trigger.getAttribute('aria-expanded')).toBe('true')
      expect(container.querySelector(`[id="${panelId}"]`)).not.toBeNull()
      pageLang.value = 'zh-CN'
      await nextTick()
      expect(trigger.getAttribute('aria-label')).toBe('收起分享')
      for (const page of [
        { socialShare: { networks: [] } },
        { socialShare: { networks: ['invalid'] } },
        { noSocialShare: true },
        { noGlobalSocialShare: true },
      ]) {
        frontmatter.value = page
        // oxlint-disable-next-line no-await-in-loop -- Each route must finish rendering before the next navigation.
        await nextTick()
        // oxlint-disable-next-line vitest/max-expects -- This loop checks each independent disabling rule.
        expect(container.querySelector('.social-share-global')).toBeNull()
      }
      expect(warn).toHaveBeenCalledWith(
        '[social-share] Unknown network: invalid',
      )
      frontmatter.value = {}
      await nextTick()
      // oxlint-disable-next-line vitest/max-expects -- Navigation must also restore the trigger.
      expect(container.querySelector('.social-share-global')).not.toBeNull()
    })
  })

  describe('sharing hooks and events', () => {
    it('discards a pending QR result after same-page navigation', async () => {
      const pending = Promise.withResolvers<string>()
      renderQRCode.mockReturnValueOnce(pending.promise)
      const onShareEvent = vi.fn<(event: SocialShareEvent) => void>()
      const { container } = mountSocialShare(
        { networks: ['qrcode'] },
        {},
        { onShareEvent },
      )
      getButton(container).click()
      await vi.dynamicImportSettled()

      route.fullPath = '/guide/#next'
      await nextTick()
      pending.resolve('data:image/png;base64,b2xk')
      await vi.dynamicImportSettled()

      expect(document.querySelector('.social-share-overlay')).toBeNull()
      expect(onShareEvent).not.toHaveBeenCalled()
    })

    it('cancels synchronously and emits both app and component events', () => {
      const globalEvent = vi.fn<(event: SocialShareEvent) => void>()
      const localEvent = vi.fn<(event: SocialShareEvent) => void>()
      const { container } = mountSocialShare(
        { 'onShare-event': localEvent },
        {},
        {
          beforeShare: () => false,
          onShareEvent: globalEvent,
        },
      )
      getButton(container).click()
      expect(window.open).not.toHaveBeenCalled()
      expect(globalEvent).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ status: 'cancelled' }),
      )
      expect(localEvent).toHaveBeenCalledWith(globalEvent.mock.calls[0][0])
    })

    it('patches only the current metadata, including the QR URL', async () => {
      const events = vi.fn<(event: SocialShareEvent) => void>()
      const { container } = mountSocialShare(
        { networks: ['qrcode'] },
        {},
        {
          beforeShare: () => ({
            url: 'https://patched.example/',
            title: 'Patched',
          }),
          onShareEvent: events,
        },
      )
      getButton(container).click()
      await vi.dynamicImportSettled()
      expect(renderQRCode).toHaveBeenCalledWith(
        'https://patched.example/',
        expect.any(Object),
      )
      expect(events).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'displayed' }),
      )
      expect(frontmatter.value.shareUrl).toBe('https://example.com/guide/')
    })

    it('patches popup metadata and reports opened without claiming publication', () => {
      vi.mocked(window.open).mockReturnValue(window)
      vi.spyOn(window, 'focus').mockImplementation(() => {})
      const onShareEvent = vi.fn<(event: SocialShareEvent) => void>()
      const { container } = mountSocialShare(
        {},
        {},
        {
          beforeShare: () => ({ title: 'Patched' }),
          onShareEvent,
        },
      )
      expect(share(container).searchParams.get('text')).toBe('Patched')
      expect(onShareEvent).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ status: 'opened' }),
      )
      expect(frontmatter.value.title).toBe('Share test')
    })

    it('reports blocked windows and preserves the original error from hooks', () => {
      const onShareEvent = vi.fn<(event: SocialShareEvent) => void>()
      const first = mountSocialShare({}, {}, { onShareEvent })
      getButton(first.container).click()
      expect(onShareEvent).toHaveBeenLastCalledWith(
        expect.objectContaining({ status: 'error', stage: 'action' }),
      )
      const error = new Error('Hook failed')
      const second = mountSocialShare(
        {},
        {},
        {
          beforeShare: () => {
            throw error
          },
          onShareEvent,
        },
      )
      getButton(second.container).click()
      expect(onShareEvent).toHaveBeenLastCalledWith(
        expect.objectContaining({
          status: 'error',
          stage: 'before-share',
          error,
        }),
      )
      // oxlint-disable-next-line vitest/prefer-called-once -- The competing prefer-called-times rule requires this spelling.
      expect(window.open).toHaveBeenCalledTimes(1)
    })

    it('rejects async hooks at runtime even from untyped consumers', () => {
      const onShareEvent = vi.fn<(event: SocialShareEvent) => void>()
      const { container } = mountSocialShare(
        {},
        {},
        {
          // @ts-expect-error Async pre-hooks intentionally violate the public contract.
          beforeShare: () => Promise.resolve({ title: 'Late title' }),
          onShareEvent,
        },
      )
      getButton(container).click()
      expect(window.open).not.toHaveBeenCalled()
      expect(onShareEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          stage: 'before-share',
          error: expect.any(TypeError),
        }),
      )
    })

    it.each([false, true])(
      'isolates event callback failures (async=%s)',
      async isAsync => {
        const error = new Error('Analytics failed')
        const log = vi.spyOn(console, 'error').mockImplementation(() => {})
        const localEvent = vi.fn<(event: SocialShareEvent) => void>()
        vi.mocked(window.open).mockReturnValue(window)
        vi.spyOn(window, 'focus').mockImplementation(() => {})
        const { container } = mountSocialShare(
          { 'onShare-event': localEvent },
          {},
          {
            onShareEvent: () => {
              // oxlint-disable-next-line vitest/no-conditional-in-test -- Both listener failure modes use the same assertions.
              if (isAsync) {
                return Promise.reject(error)
              }
              throw error
            },
          },
        )
        getButton(container).click()
        await nextTick()
        expect(localEvent).toHaveBeenCalledExactlyOnceWith(
          expect.objectContaining({ status: 'opened' }),
        )
        expect(log).toHaveBeenCalledWith(
          '[social-share] Event listener failed:',
          error,
        )
      },
    )

    it('cancels a pending QR render on route change', async () => {
      const pending = Promise.withResolvers<string>()
      renderQRCode.mockReturnValueOnce(pending.promise)
      const onShareEvent = vi.fn<(event: SocialShareEvent) => void>()
      const { container } = mountSocialShare(
        { networks: ['qrcode'] },
        {},
        { onShareEvent },
      )
      getButton(container).click()
      await vi.dynamicImportSettled()
      frontmatter.value = { title: 'Next page' }
      await nextTick()
      pending.resolve('data:image/png;base64,dGVzdA==')
      await vi.dynamicImportSettled()
      expect(document.querySelector('.social-share-overlay')).toBeNull()
      expect(onShareEvent).not.toHaveBeenCalled()
    })
  })

  describe('clipboard and native sharing', () => {
    it('copies the patched URL and emits copied only after the write finishes', async () => {
      const writeText = mockClipboard()
      const pending = Promise.withResolvers<undefined>()
      writeText.mockReturnValueOnce(pending.promise)
      const onShareEvent = vi.fn<(event: SocialShareEvent) => void>()
      const { container } = mountSocialShare(
        { networks: ['copy'] },
        {},
        {
          beforeShare: () => ({ url: 'https://patched.example/?a=1&b=2' }),
          onShareEvent,
        },
      )
      getButton(container).click()
      getButton(container).click()
      expect(writeText).toHaveBeenCalledExactlyOnceWith(
        'https://patched.example/?a=1&b=2',
      )
      expect(onShareEvent).not.toHaveBeenCalled()
      await nextTick()
      expect(getButton(container).disabled).toBe(true)
      // oxlint-disable-next-line unicorn/no-useless-undefined -- Promise<undefined> requires an explicit value.
      pending.resolve(undefined)
      await vi.waitFor(() => expect(getButton(container).disabled).toBe(false))
      expect(container.querySelector('[role="status"]')?.textContent).toBe(
        'Link copied',
      )
      expect(onShareEvent).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'copied' }),
      )
      pageLang.value = 'zh-CN'
      await nextTick()
      // oxlint-disable-next-line vitest/max-expects -- Locale changes update already-visible feedback.
      expect(container.querySelector('[role="status"]')?.textContent).toBe(
        '链接已复制',
      )
    })

    it('copies Markdown and shows the exact text for manual fallback on rejection', async () => {
      const writeText = mockClipboard()
      const error = new Error('Permission denied')
      writeText.mockRejectedValueOnce(error)
      const onShareEvent = vi.fn<(event: SocialShareEvent) => void>()
      const { container } = mountSocialShare(
        { networks: ['copy-markdown'] },
        {},
        { onShareEvent },
      )
      getButton(container).click()
      await vi.waitFor(() =>
        expect(container.querySelector('textarea')).not.toBeNull(),
      )
      expect(writeText).toHaveBeenCalledWith(
        '[Share test](https://example.com/guide/)',
      )
      const textarea = container.querySelector('textarea')
      expect(textarea?.value).toBe('[Share test](https://example.com/guide/)')
      expect(textarea?.readOnly).toBe(true)
      expect(onShareEvent).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'error', stage: 'action', error }),
      )
    })

    it('falls back to manual copying when the API is missing or the context is insecure', async () => {
      const writeText = mockClipboard()
      vi.stubGlobal('isSecureContext', false)
      const first = mountSocialShare({ networks: ['copy'] })
      getButton(first.container).click()
      await vi.waitFor(() =>
        expect(first.container.querySelector('textarea')).not.toBeNull(),
      )
      expect(writeText).not.toHaveBeenCalled()
      vi.stubGlobal('isSecureContext', true)
      mockMissingNavigatorProperty('clipboard')
      const second = mountSocialShare({ networks: ['copy'] })
      getButton(second.container).click()
      await vi.waitFor(() =>
        expect(second.container.querySelector('textarea')).not.toBeNull(),
      )
    })

    it('hides unavailable native sharing, including an otherwise empty global trigger', async () => {
      vi.stubGlobal('isSecureContext', true)
      mockMissingNavigatorProperty('share')
      const { container } = mountSocialShare({ networks: ['native'] })
      await nextTick()
      expect(container.querySelector('button')).toBeNull()
      const global = mountSocialShare(
        {},
        {
          networksData: [
            { ...BUILT_IN_NETWORKS.native, name: 'native', default: true },
          ],
        },
        { global: true },
      )
      await nextTick()
      expect(global.container.querySelector('button')).toBeNull()
    })

    it('calls native sharing in the click stack and guards duplicate requests', async () => {
      vi.stubGlobal('isSecureContext', true)
      const pending = Promise.withResolvers<undefined>()
      const native = mockNativeShare().mockReturnValue(pending.promise)
      const onShareEvent = vi.fn<(event: SocialShareEvent) => void>()
      const { container } = mountSocialShare(
        { networks: ['native'] },
        {},
        { onShareEvent },
      )
      await nextTick()
      getButton(container).click()
      getButton(container).click()
      expect(native).toHaveBeenCalledExactlyOnceWith({
        title: 'Share test',
        text: '',
        url: 'https://example.com/guide/',
      })
      expect(onShareEvent).not.toHaveBeenCalled()
      // oxlint-disable-next-line unicorn/no-useless-undefined -- Promise<undefined> requires an explicit value.
      pending.resolve(undefined)
      await vi.waitFor(() =>
        expect(onShareEvent).toHaveBeenCalledWith(
          expect.objectContaining({ status: 'handed-off' }),
        ),
      )
    })

    it.each([
      { name: 'AbortError', status: 'cancelled' },
      { name: 'NotAllowedError', status: 'error' },
    ])('reports native $name without copying', async ({ name, status }) => {
      const writeText = mockClipboard()
      const error = new DOMException('Native sharing failed', name)
      mockNativeShare().mockRejectedValue(error)
      const onShareEvent = vi.fn<(event: SocialShareEvent) => void>()
      const { container } = mountSocialShare(
        { networks: ['native'] },
        {},
        { onShareEvent },
      )
      await nextTick()
      getButton(container).click()
      await vi.waitFor(() =>
        expect(onShareEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            status,
          }),
        ),
      )
      expect(writeText).not.toHaveBeenCalled()
    })

    it('ignores clipboard completion after unmount', async () => {
      const writeText = mockClipboard()
      const pending = Promise.withResolvers<undefined>()
      writeText.mockReturnValueOnce(pending.promise)
      const onShareEvent = vi.fn<(event: SocialShareEvent) => void>()
      const { container, unmount } = mountSocialShare(
        { networks: ['copy'] },
        {},
        { onShareEvent },
      )
      getButton(container).click()
      unmount()
      // oxlint-disable-next-line unicorn/no-useless-undefined -- Promise<undefined> requires an explicit value.
      pending.resolve(undefined)
      await nextTick()
      expect(onShareEvent).not.toHaveBeenCalled()
    })
  })
  describe('layout attributes', () => {
    it('preserves default layout and emits inline direction', () => {
      const global = mountSocialShare({}, {}, { global: true })
      const toolbar = global.container.querySelector<HTMLElement>(
        '.social-share-global',
      )
      expect(toolbar?.dataset).toMatchObject({
        position: 'right',
        direction: 'vertical',
        mobilePosition: 'right',
        mobileDirection: 'vertical',
      })
      const inline = mountSocialShare({ direction: 'vertical' })
      expect(
        inline.container.querySelector<HTMLElement>('.social-share')?.dataset
          .direction,
      ).toBe('vertical')
    })

    it('resolves mobile overrides independently and inherits omitted fields', () => {
      const { container } = mountSocialShare(
        {},
        {
          globalLayout: {
            position: 'left',
            direction: 'vertical',
            mobile: { position: 'bottom', direction: 'horizontal' },
          },
        },
        { global: true },
      )
      expect(
        container.querySelector<HTMLElement>('.social-share-global')?.dataset,
      ).toMatchObject({
        position: 'left',
        direction: 'vertical',
        mobilePosition: 'bottom',
        mobileDirection: 'horizontal',
      })
      const inherited = mountSocialShare(
        {},
        {
          globalLayout: {
            position: 'bottom',
            direction: 'horizontal',
            mobile: { direction: 'vertical' },
          },
        },
        { global: true },
      )
      expect(
        inherited.container.querySelector<HTMLElement>('.social-share-global')
          ?.dataset,
      ).toMatchObject({
        position: 'bottom',
        direction: 'horizontal',
        mobilePosition: 'bottom',
        mobileDirection: 'vertical',
      })
    })
  })
  describe('share presentations', () => {
    it('applies dark icons after hydrating server-rendered light markup', async () => {
      const container = document.createElement('div')
      container.innerHTML = await renderToString(createSharingSSRApp())
      document.body.append(container)
      darkMode.value = true
      const app = createSharingSSRApp()
      apps.add(app)
      app.mount(container)
      await nextTick()
      expect(getElement(container, '.social-share-icon-svg').style.color).toBe(
        BUILT_IN_NETWORKS.x.color.dark,
      )
    })

    it('keeps the original toolbar and icon-only list by default', async () => {
      const { container } = mountSocialShare({}, {}, { global: true })
      expect(
        getElement(container, '.social-share-global').dataset.variant,
      ).toBe('toolbar')
      getButton(container).click()
      await nextTick()
      expect(container.querySelector('[role="dialog"]')).toBeNull()
      expect(container.querySelector('.social-share-label')).toBeNull()
      expect(getElement(container, '.social-share').dataset.variant).toBe(
        'default',
      )
      expect(container.querySelectorAll('.social-share-network')).toHaveLength(
        1,
      )
    })

    it('inherits inline appearance from frontmatter and lets props restore the old style', () => {
      frontmatter.value.socialShare = { variant: 'compact' }
      const inherited = mountSocialShare()
      const override = mountSocialShare({ variant: 'default' })
      expect(
        getElement(inherited.container, '.social-share').dataset.variant,
      ).toBe('compact')
      expect(
        getElement(override.container, '.social-share').dataset.variant,
      ).toBe('default')
    })

    it('groups configured actions and platforms with localized visible labels', async () => {
      pageLang.value = 'zh-CN'
      frontmatter.value.socialShare = {
        networks: ['wechat', 'copy-markdown', 'twitter', 'native', 'copy'],
        globalLayout: { variant: 'panel', mobile: { position: 'bottom' } },
      }
      const { container } = mountSocialShare(
        {},
        {
          globalLayout: {
            position: 'left',
            mobile: { direction: 'horizontal' },
          },
          locales: {
            '/': { panelTitle: '分享本文', networkLabels: { wechat: '微信' } },
          },
        },
        { global: true },
      )
      expect(
        getElement(container, '.social-share-global').dataset,
      ).toMatchObject({
        variant: 'panel',
        position: 'left',
        mobilePosition: 'bottom',
        mobileDirection: 'horizontal',
      })
      getButton(container).click()
      await nextTick()
      expect(
        getElement(container, '[role="dialog"]').getAttribute(
          'aria-labelledby',
        ),
      ).toBe(getElement(container, '.social-share-panel-title').id)
      expect(
        getElement(container, '.social-share-panel-title').textContent,
      ).toBe('分享本文')
      expect(
        [
          ...container.querySelectorAll(
            '.social-share-quick-actions .social-share-label',
          ),
        ].map(label => label.textContent),
      ).toStrictEqual(['复制 Markdown 链接', '复制链接'])
      expect(
        [
          ...container.querySelectorAll(
            '.social-share-platform-grid .social-share-label',
          ),
        ].map(label => label.textContent),
      ).toStrictEqual(['微信', 'Twitter'])
    })

    it('restores focus when closed by the button or Escape', async () => {
      const { container } = mountSocialShare(
        {},
        { globalLayout: { variant: 'panel' } },
        { global: true },
      )
      const trigger = getElement<HTMLButtonElement>(
        container,
        '.social-share-trigger',
      )
      trigger.click()
      await nextTick()
      const close = getElement<HTMLButtonElement>(
        container,
        '.social-share-panel-close',
      )
      expect(document.activeElement).toBe(close)
      close.click()
      await nextTick()
      expect(document.activeElement).toBe(trigger)
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      trigger.click()
      await nextTick()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await nextTick()
      expect(document.activeElement).toBe(trigger)
      expect(container.querySelector('[role="dialog"]')).toBeNull()
    })

    it('lets pages restore the toolbar and reacts to frontmatter appearance changes', async () => {
      frontmatter.value.socialShare = { globalLayout: { variant: 'toolbar' } }
      const { container } = mountSocialShare(
        {},
        {
          globalLayout: { variant: 'panel', position: 'left' },
        },
        { global: true },
      )
      getButton(container).click()
      await nextTick()
      expect(
        getElement(container, '.social-share-global').dataset.variant,
      ).toBe('toolbar')
      expect(container.querySelector('[role="dialog"]')).toBeNull()
      frontmatter.value = {
        ...frontmatter.value,
        socialShare: { variant: 'compact', globalLayout: { variant: 'panel' } },
      }
      await nextTick()
      expect(
        getElement(container, '.social-share-global').dataset,
      ).toMatchObject({ variant: 'panel', position: 'left' })
      expect(
        getElement(container, '.social-share-trigger').getAttribute(
          'aria-expanded',
        ),
      ).toBe('false')
    })

    it('dismisses the panel on outside clicks or navigation', async () => {
      const { container } = mountSocialShare(
        {},
        { globalLayout: { variant: 'panel' } },
        { global: true },
      )
      const trigger = getElement<HTMLButtonElement>(
        container,
        '.social-share-trigger',
      )
      trigger.click()
      await nextTick()
      document.body.click()
      await nextTick()
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      trigger.click()
      await nextTick()
      route.fullPath = '/next-page/'
      await nextTick()
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
    })

    it('shares one feedback region across the panel and supports manual copying', async () => {
      const writeText = mockClipboard()
      frontmatter.value.socialShare = { networks: ['copy', 'twitter'] }
      const { container } = mountSocialShare(
        {},
        { globalLayout: { variant: 'panel' } },
        { global: true },
      )
      getButton(container).click()
      await nextTick()
      const copy = getElement<HTMLButtonElement>(
        container,
        '.social-share-quick-actions button',
      )
      copy.click()
      await vi.waitFor(() =>
        expect(getElement(container, '[role="status"]').textContent).toBe(
          'Link copied',
        ),
      )
      writeText.mockRejectedValueOnce(new Error('Clipboard denied'))
      copy.click()
      await vi.waitFor(() =>
        expect(container.querySelector('textarea')).not.toBeNull(),
      )
      const text = getElement<HTMLTextAreaElement>(container, 'textarea')
      expect(text.value).toBe('https://example.com/guide/')
      text.focus()
      expect(text.selectionEnd).toBe(text.value.length)
      expect(container.querySelectorAll('[role="status"]')).toHaveLength(1)
      expect(
        getElement(container, '.social-share-trigger').getAttribute(
          'aria-expanded',
        ),
      ).toBe('true')
    })

    it('leaves the parent panel open while the QR modal handles Escape', async () => {
      frontmatter.value.socialShare = { networks: ['wechat'] }
      const { container } = mountSocialShare(
        {},
        { globalLayout: { variant: 'panel' } },
        { global: true },
      )
      getButton(container).click()
      await nextTick()
      getElement<HTMLButtonElement>(
        container,
        '.social-share-network button',
      ).click()
      await vi.dynamicImportSettled()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await nextTick()
      expect(
        getElement(container, '.social-share-trigger').getAttribute(
          'aria-expanded',
        ),
      ).toBe('true')
      document
        .querySelector('dialog')
        ?.dispatchEvent(new Event('cancel', { cancelable: true }))
      await nextTick()
      expect(container.querySelector('[role="dialog"]')).not.toBeNull()
      expect(document.querySelector('.social-share-overlay')).toBeNull()
    })
  })

  describe('local event failures', () => {
    it('reports rejected local listener Promises without an unhandled rejection', async () => {
      const error = new Error('Async local listener failed')
      const log = vi.spyOn(console, 'error').mockImplementation(() => {})
      const onShareEvent = vi.fn<(event: SocialShareEvent) => void>()
      mockClipboard()
      const { container } = mountSocialShare(
        { networks: ['copy'], 'onShare-event': () => Promise.reject(error) },
        {},
        { onShareEvent },
      )
      getButton(container).click()
      await vi.waitFor(() =>
        expect(log).toHaveBeenCalledWith(
          '[social-share] Event listener failed:',
          error,
        ),
      )
      expect(onShareEvent).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ status: 'copied' }),
      )
      expect(getButton(container).disabled).toBe(false)
    })

    it('isolates handlers in merged listener arrays', async () => {
      const error = new Error('First listener failed')
      const log = vi.spyOn(console, 'error').mockImplementation(() => {})
      const second = vi.fn<(event: SocialShareEvent) => void>()
      mockClipboard()
      const props = mergeProps(
        { networks: ['copy'], 'onShare-event': () => Promise.reject(error) },
        { 'onShare-event': second },
      )
      const { container } = mountSocialShare(props)
      getButton(container).click()
      await vi.waitFor(() =>
        expect(log).toHaveBeenCalledWith(
          '[social-share] Event listener failed:',
          error,
        ),
      )
      expect(second).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ status: 'copied' }),
      )
    })

    it('guards replaced listeners when only event props change', async () => {
      const error = new Error('Updated listener failed')
      const log = vi.spyOn(console, 'error').mockImplementation(() => {})
      const initial = vi.fn<(event: SocialShareEvent) => unknown>()
      const props = reactive({ networks: ['copy'], 'onShare-event': initial })
      const { container } = mountSocialShare(
        props,
        {},
        { beforeShare: () => false },
      )
      const replacement = vi
        .fn<(event: SocialShareEvent) => unknown>()
        .mockRejectedValue(error)
      props['onShare-event'] = replacement
      await nextTick()
      getButton(container).click()
      await vi.waitFor(() =>
        expect(log).toHaveBeenCalledWith(
          '[social-share] Event listener failed:',
          error,
        ),
      )
      expect(initial).not.toHaveBeenCalled()
    })

    it('guards rejected once listeners using Vue camel-case event props', async () => {
      const error = new Error('Once listener failed')
      const log = vi.spyOn(console, 'error').mockImplementation(() => {})
      const once = vi
        .fn<(event: SocialShareEvent) => unknown>()
        .mockRejectedValue(error)
      const { container } = mountSocialShare(
        mergeProps({ onShareEventOnce: once }),
        {},
        { beforeShare: () => false },
      )
      getButton(container).click()
      getButton(container).click()
      await vi.waitFor(() =>
        expect(log).toHaveBeenCalledExactlyOnceWith(
          '[social-share] Event listener failed:',
          error,
        ),
      )
      expect(once).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ status: 'cancelled' }),
      )
    })

    it('preserves once listeners and uses updated regular listeners', async () => {
      const first = vi.fn<(event: SocialShareEvent) => void>()
      const second = vi.fn<(event: SocialShareEvent) => void>()
      const once = vi.fn<(event: SocialShareEvent) => void>()
      const props = reactive({
        'onShare-event': first,
        'onShare-eventOnce': once,
      })
      const { container } = mountSocialShare(
        props,
        {},
        { beforeShare: () => false },
      )
      getButton(container).click()
      props['onShare-event'] = second
      await nextTick()
      getButton(container).click()
      expect(first).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ status: 'cancelled' }),
      )
      expect(second).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ status: 'cancelled' }),
      )
      expect(once).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ status: 'cancelled' }),
      )
    })

    it('keeps the opened result when a synchronous local listener throws', () => {
      const error = new Error('Local listener failed')
      const onShareEvent = vi.fn<(event: SocialShareEvent) => void>()
      const log = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.spyOn(console, 'warn').mockImplementation(() => {})
      vi.mocked(window.open).mockReturnValue(window)
      vi.spyOn(window, 'focus').mockImplementation(() => {})
      const { container } = mountSocialShare(
        {
          'onShare-event': () => {
            throw error
          },
        },
        {},
        { onShareEvent },
      )
      getButton(container).click()
      expect(onShareEvent).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ status: 'opened' }),
      )
      expect(log).toHaveBeenCalledWith(
        '[social-share] Event listener failed:',
        error,
      )
    })
  })

  describe('action boundary cases', () => {
    it('copies Markdown successfully and restores buttons after completion', async () => {
      const writeText = mockClipboard()
      const onShareEvent = vi.fn<(event: SocialShareEvent) => void>()
      const { container } = mountSocialShare(
        { networks: ['copy-markdown'] },
        {},
        { onShareEvent },
      )
      getButton(container).click()
      await vi.waitFor(() =>
        expect(container.querySelector('[role="status"]')?.textContent).toBe(
          'Markdown link copied',
        ),
      )
      expect(getButton(container).disabled).toBe(false)
      expect(writeText).toHaveBeenCalledWith(
        '[Share test](https://example.com/guide/)',
      )
      expect(onShareEvent).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ status: 'copied' }),
      )
    })

    it('handles a synchronous native exception after capability detection', async () => {
      vi.stubGlobal('isSecureContext', true)
      const error = new Error('Native API failed')
      mockNativeShare().mockImplementation(() => {
        throw error
      })
      const onShareEvent = vi.fn<(event: SocialShareEvent) => void>()
      const { container } = mountSocialShare(
        { networks: ['native'] },
        {},
        { onShareEvent },
      )
      await nextTick()
      getButton(container).click()
      await nextTick()
      expect(onShareEvent).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ status: 'error', error }),
      )
      expect(getButton(container).disabled).toBe(false)
    })

    it('reports a QR error event with the original cause', async () => {
      const error = new Error('QR failed')
      renderQRCode.mockRejectedValueOnce(error)
      vi.spyOn(console, 'error').mockImplementation(() => {})
      const onShareEvent = vi.fn<(event: SocialShareEvent) => void>()
      const { container } = mountSocialShare(
        { networks: ['qrcode'] },
        {},
        { onShareEvent },
      )
      getButton(container).click()
      await vi.dynamicImportSettled()
      expect(onShareEvent).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ status: 'error', stage: 'action', error }),
      )
    })

    it('rejects invalid metadata patches without invoking the browser', () => {
      const onShareEvent = vi.fn<(event: SocialShareEvent) => void>()
      const { container } = mountSocialShare(
        {},
        {},
        {
          // @ts-expect-error External JavaScript can return invalid metadata.
          beforeShare: () => ({ url: 123 }),
          onShareEvent,
        },
      )
      getButton(container).click()
      expect(window.open).not.toHaveBeenCalled()
      expect(onShareEvent).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'error', stage: 'before-share' }),
      )
    })
  })
})
