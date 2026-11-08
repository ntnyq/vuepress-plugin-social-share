import { onBeforeUnmount } from 'vue'
import type { Ref } from 'vue'
import type {
  SocialShareContext,
  SocialShareEvent,
  SocialShareLocaleData,
  SocialShareQRCodeOptions,
} from '../../shared'

// A document has one modal QR surface, even across independent Vue apps.
const activeQRCodes = new WeakMap<Document, (restoreFocus?: boolean) => void>()

/**
 * Owns this component's QR request and modal, coordinating exclusivity per document.
 * Reset, replacement and unmount invalidate requests and release the owned modal.
 *
 * @param options - Reactive QR renderer options and localized alternative text.
 * @param publish - Dispatcher for displayed and action-error share outcomes.
 * @returns An asynchronous show action and a synchronous reset action.
 */
export function useShareQRCode(
  options: {
    /**
     * Renderer options captured before asynchronous QR code generation begins.
     */
    render: Readonly<Ref<SocialShareQRCodeOptions>>
    /**
     * Current messages used for the QR image alternative text.
     */
    locale: Readonly<Ref<SocialShareLocaleData>>
  },
  publish: (event: SocialShareEvent) => void,
) {
  let qrcodeRequestId = 0
  let qrcodeOverlay: HTMLDialogElement | null = null
  let trigger: HTMLElement | null = null
  let ownerDocument: Document | null = null

  /**
   * Invalidates this request and releases its modal without affecting another owner.
   *
   * @param restoreFocus - Whether to return focus to the connected sharing trigger.
   */
  const reset = (restoreFocus = true) => {
    qrcodeRequestId++
    if (ownerDocument && activeQRCodes.get(ownerDocument) === reset) {
      activeQRCodes.delete(ownerDocument)
    }
    const overlay = qrcodeOverlay
    qrcodeOverlay = null
    overlay?.close()
    overlay?.remove()
    if (overlay && restoreFocus && trigger?.isConnected) {
      trigger.focus()
    }
    trigger = null
  }
  /**
   * Generates a QR image and displays it if this is still the latest request.
   *
   * @param context - Share snapshots whose URL is encoded in the QR image.
   * @returns A Promise that resolves after display, stale-request cancellation or error reporting.
   */
  const showQRCode = async (context: SocialShareContext) => {
    const activeElement = document.activeElement
    activeQRCodes.get(document)?.(false)
    ownerDocument = document
    activeQRCodes.set(document, reset)
    trigger = activeElement instanceof HTMLElement ? activeElement : null
    const requestId = ++qrcodeRequestId
    const shareURL = context.meta.url
    const renderOptions = options.render.value
    try {
      const QRCode = await import('qrcode')
      if (requestId !== qrcodeRequestId) {
        return
      }
      const dataURL = await QRCode.toDataURL(shareURL, renderOptions)
      if (requestId !== qrcodeRequestId) {
        return
      }

      const overlay = document.createElement('dialog')
      const image = document.createElement('img')
      const closeButton = document.createElement('button')

      overlay.id = '__VUEPRESS_SOCIAL_SHARE__'
      overlay.classList.add('social-share-overlay', 'show')
      overlay.setAttribute('aria-label', options.locale.value.qrcodeAlt)
      overlay.setAttribute('aria-modal', 'true')
      image.classList.add('social-share-qrcode')
      image.src = dataURL
      image.alt = options.locale.value.qrcodeAlt
      closeButton.type = 'button'
      closeButton.classList.add('social-share-qrcode-close')
      closeButton.textContent = options.locale.value.qrcodeClose
      overlay.append(image, closeButton)

      overlay.addEventListener(
        'click',
        (evt: MouseEvent) => {
          reset()
          evt.stopPropagation()
        },
        { once: true },
      )
      overlay.addEventListener('cancel', event => {
        event.preventDefault()
        reset()
      })
      qrcodeOverlay = overlay
      document.body.append(overlay)
      overlay.showModal()
      closeButton.focus()
      publish({ ...context, status: 'displayed' })
    } catch (error) {
      if (requestId === qrcodeRequestId) {
        reset()
        console.error('Failed to generate QR code:', error)
        publish({ ...context, status: 'error', stage: 'action', error })
      }
    }
  }

  onBeforeUnmount(() => reset(false))
  return { show: showQRCode, reset }
}
