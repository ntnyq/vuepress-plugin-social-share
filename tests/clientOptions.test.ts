import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import {
  configureSocialShare,
  useSocialShareClientOptions,
} from '../src/client/helpers/clientOptions'
import { injectSocialShareOptions } from '../src/client/helpers/socialShare'
import type { SocialShareClientOptions } from '../src/shared'

function createConfiguredApp(
  hooks: SocialShareClientOptions,
  configureFirst: boolean,
) {
  const app = createSSRApp(
    defineComponent({
      setup() {
        const options = useSocialShareClientOptions()
        return () => h('div', String(options === hooks))
      },
    }),
  )
  if (configureFirst) {
    configureSocialShare(app, hooks)
  }
  injectSocialShareOptions(app, { networksData: [] })
  if (!configureFirst) {
    configureSocialShare(app, hooks)
  }
  return app
}

describe('client hook configuration', () => {
  it.each([true, false])(
    'is independent of static enhance order (first=%s)',
    async first => {
      const app = createConfiguredApp({ beforeShare: () => false }, first)
      await expect(renderToString(app)).resolves.toBe('<div>true</div>')
    },
  )

  it('isolates configuration between Vue Apps', async () => {
    const hook = vi.fn<NonNullable<SocialShareClientOptions['beforeShare']>>()
    const first = createConfiguredApp({ beforeShare: hook }, true)
    const second = createConfiguredApp({}, false)
    await expect(renderToString(first)).resolves.toBe('<div>true</div>')
    await expect(renderToString(second)).resolves.toBe('<div>true</div>')
    expect(hook).not.toHaveBeenCalled()
  })
})
