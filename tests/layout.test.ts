import { readFile } from 'node:fs/promises'
import { Window } from 'happy-dom'
import { describe, expect, it } from 'vitest'

async function getToolbarStyles(mobilePosition: string) {
  const window = new Window({ width: 390, height: 844 })
  const style = window.document.createElement('style')
  style.textContent = await readFile(
    new URL('../src/client/styles/social-share.css', import.meta.url),
    'utf8',
  )
  const toolbar = window.document.createElement('div')
  toolbar.className = 'social-share-global'
  toolbar.dataset.position = 'bottom'
  toolbar.dataset.mobilePosition = mobilePosition
  window.document.head.append(style)
  window.document.body.append(toolbar)
  return window.getComputedStyle(toolbar)
}

describe('responsive toolbar positioning', () => {
  it.each(['left', 'right'])(
    'fully overrides desktop bottom positioning on mobile %s',
    async position => {
      const style = await getToolbarStyles(position)
      expect(style.transform).toBe('none')
      expect(style.bottom).toBe('15%')
    },
  )

  it('keeps centering when mobile positioning remains bottom', async () => {
    const style = await getToolbarStyles('bottom')
    expect(style.transform).toBe('translateX(-50%)')
  })
})
