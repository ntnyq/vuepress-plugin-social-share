import { onMounted, reactive } from 'vue'

/**
 * Prepares a centered 626-by-436 sharing popup using mounted viewport dimensions.
 *
 * @returns A function accepting the share URL that opens and focuses the named popup;
 * it throws an Error when the browser blocks the popup.
 */
export function useShareWindow() {
  const popup = reactive({
    status: false,
    resizable: false,
    toolbar: false,
    menubar: false,
    scrollbars: false,
    location: false,
    directories: false,
    width: 626,
    height: 436,
    top: 0,
    left: 0,
  })

  /**
   * Opens and focuses the sharing popup using its mounted screen coordinates.
   *
   * @param shareURL - Expanded sharing destination to open.
   * @returns Nothing; opens or reuses the named browser popup.
   * @throws {Error} When the browser blocks the popup.
   */
  const openSharer = (shareURL: string) => {
    const shareParams: string[] = [
      `status=${popup.status ? 'yes' : 'no'}`,
      `height=${popup.height}`,
      `width=${popup.width}`,
      `resizable=${popup.resizable ? 'yes' : 'no'}`,
      `left=${popup.left}`,
      `top=${popup.top}`,
      `screenX=${popup.left}`,
      `screenY=${popup.top}`,
      `toolbar=${popup.toolbar ? 'yes' : 'no'}`,
      `menubar=${popup.menubar ? 'yes' : 'no'}`,
      `scrollbars=${popup.scrollbars ? 'yes' : 'no'}`,
      `location=${popup.location ? 'yes' : 'no'}`,
      `directories=${popup.directories ? 'yes' : 'no'}`,
    ]
    const popWindow = window.open(shareURL, 'sharer', shareParams.join(','))
    if (!popWindow) {
      throw new Error('Share window was blocked')
    }
    popWindow.focus?.()
  }
  onMounted(() => {
    /**
     * Center the popup on dual screens
     * http://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen/32261263
     */
    const rootEl = document.documentElement
    const dualScreenLeft = window.screenLeft ?? window.screenX
    const dualScreenTop = window.screenTop ?? window.screenY
    const width = window.innerWidth ?? rootEl.clientWidth ?? screen.width
    const height = window.innerHeight ?? rootEl.clientHeight ?? screen.height
    popup.left = width / 2 - popup.width / 2 + dualScreenLeft
    popup.top = height / 2 - popup.height / 2 + dualScreenTop
  })

  return openSharer
}
