import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SocialShareNetwork } from '../src/client/components/SocialShareNetwork'
import type { ThemeableValue } from '../src/shared'

vi.mock(import('vuepress/client'), () => ({
  withBase: (url: string) => `/docs/${url.replace(/^\//u, '')}`,
}))

function renderIcon(icon: ThemeableValue, isDark = false) {
  return renderToString(
    createSSRApp({
      render: () =>
        h(SocialShareNetwork, {
          network: { name: 'custom', type: 'qrcode', icon },
          isDark,
        }),
    }),
  )
}

describe('network icons', () => {
  it('prefixes public icons with the site base during SSR', async () => {
    await expect(renderIcon('/pinterest.png')).resolves.toContain(
      'background-image:url(/docs/pinterest.png)',
    )
  })

  it('resolves the base after selecting the themed icon', async () => {
    await expect(
      renderIcon({ light: '/light.png', dark: '/dark.png' }, true),
    ).resolves.toContain('background-image:url(/docs/dark.png)')
  })

  it.each([
    'https://cdn.example.com/icon.png',
    '//cdn.example.com/icon.png',
    'data:image/png;base64,dGVzdA==',
    'relative.png',
  ])('preserves non-public image URL %s', async icon => {
    await expect(renderIcon(icon)).resolves.toContain(
      `background-image:url(${icon})`,
    )
  })

  it('preserves inline SVG markup', async () => {
    const svg = '<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" /></svg>'

    await expect(renderIcon(svg)).resolves.toContain(svg)
  })
})
