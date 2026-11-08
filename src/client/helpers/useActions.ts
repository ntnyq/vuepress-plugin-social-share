import { computed, onBeforeUnmount, ref } from 'vue'
import type { Ref } from 'vue'
import type {
  SocialShareContext,
  SocialShareEvent,
  SocialShareLocaleData,
  SocialShareMeta,
  SocialShareNetworkWithName,
  SocialShareQRCodeOptions,
} from '../../shared'
import { useSocialShareClientOptions } from './clientOptions'
import { formatMarkdownLink } from './clipboard'
import { createShareURL } from './shareURL'
import { useSocialShareOptions } from './socialShare'
import { useShareQRCode } from './useQRCode'
import { useShareWindow } from './useShareWindow'

/**
 * Observes an event listener result and logs rejections without changing share state.
 *
 * @param result - Synchronous return value or Promise produced by a listener.
 * @returns A Promise that resolves after observation, including when a rejection was logged.
 */
async function reportCallbackResult(result: unknown): Promise<void> {
  try {
    await result
  } catch (error) {
    console.error('[social-share] Event listener failed:', error)
  }
}

/**
 * Checks whether a rejected browser operation represents user cancellation.
 *
 * @param error - Unknown thrown or rejected value.
 * @returns true when the value is an object whose name is AbortError.
 */
function isAbortError(error: unknown): boolean {
  return Boolean(
    error &&
    typeof error === 'object' &&
    'name' in error &&
    error.name === 'AbortError',
  )
}

/**
 * Invokes clipboard or native sharing synchronously to preserve user activation.
 *
 * @param context - Network and metadata snapshots for the selected browser action.
 * @param text - Plain URL or Markdown link to write for clipboard actions.
 * @returns The browser API Promise for the copy or system sharing operation.
 * @throws {Error} When the page is not in a secure context.
 * @throws {TypeError} When the required clipboard or system sharing API is unavailable.
 */
function invokeBrowserShare(
  context: SocialShareContext,
  text: string,
): Promise<void> {
  if (!window.isSecureContext) {
    throw new Error('Sharing requires a secure context')
  }
  if (context.network.type === 'clipboard') {
    if (typeof navigator.clipboard?.writeText !== 'function') {
      throw new TypeError('Clipboard is unavailable')
    }
    return navigator.clipboard.writeText(text)
  }
  if (typeof navigator.share !== 'function') {
    throw new TypeError('System sharing is unavailable')
  }
  return navigator.share({
    title: context.meta.title,
    text: context.meta.description,
    url: context.meta.url,
  })
}

/**
 * Coordinates per-action hooks, localized feedback and browser effects for one component.
 * Resets transient state and QR overlays when the component unmounts.
 *
 * @param meta - Resolver that reads current page metadata at the start of each action.
 * @param presentation - Reactive QR rendering options and localized messages.
 * @param emit - Component event dispatcher; listener failures are logged separately.
 * @returns Share and reset actions, feedback text, manual copy text and pending state.
 */
export function useSocialShareActions(
  meta: () => SocialShareMeta,
  presentation: {
    /**
     * Reactive QR renderer options used when displaying the current page URL.
     */
    qrcode: Readonly<Ref<SocialShareQRCodeOptions>>
    /**
     * Reactive messages used by status feedback and QR image alternative text.
     */
    locale: Readonly<Ref<SocialShareLocaleData>>
  },
  emit: (event: SocialShareEvent) => void,
) {
  const hooks = useSocialShareClientOptions()
  const options = useSocialShareOptions()
  const openSharer = useShareWindow()
  const feedbackKey = ref<
    | 'copied'
    | 'markdownCopied'
    | 'copyFailed'
    | 'shareFailed'
    | 'nativeShared'
    | 'cancelled'
  >()
  const feedback = computed(() =>
    feedbackKey.value ? presentation.locale.value[feedbackKey.value] : '',
  )
  const manualCopyText = ref('')
  const pending = ref(false)
  let actionRequestId = 0
  const publish = (event: SocialShareEvent) => {
    try {
      reportCallbackResult(hooks.onShareEvent?.(event))
    } catch (error) {
      console.error('[social-share] Event listener failed:', error)
    }
    try {
      emit(event)
    } catch (error) {
      console.error('[social-share] Event listener failed:', error)
    }
  }
  const fail = (
    context: SocialShareContext,
    stage: 'before-share' | 'action',
    error: unknown,
  ) => {
    feedbackKey.value = 'shareFailed'
    publish({ ...context, status: 'error', stage, error })
  }
  const qrcode = useShareQRCode(
    { render: presentation.qrcode, locale: presentation.locale },
    event => {
      if (event.status === 'error') {
        feedbackKey.value = 'shareFailed'
      }
      publish(event)
    },
  )
  /**
   * Invalidates pending action feedback, removes QR overlays and clears manual copy text.
   *
   * @returns Nothing; resets transient state for this component.
   */
  const reset = () => {
    actionRequestId++
    pending.value = false
    qrcode.reset()
    feedbackKey.value = undefined
    manualCopyText.value = ''
  }
  onBeforeUnmount(reset)

  const prepare = (
    network: SocialShareNetworkWithName,
  ): SocialShareContext | undefined => {
    const context: SocialShareContext = {
      network: Object.freeze({ ...network }),
      meta: Object.freeze({ ...meta() }),
    }
    try {
      const patch = hooks.beforeShare?.(context)
      if (patch === false) {
        feedbackKey.value = 'cancelled'
        publish({ ...context, status: 'cancelled' })
        return
      }
      if (patch && 'then' in patch) {
        reportCallbackResult(patch)
        throw new TypeError('beforeShare must be synchronous')
      }
      if (patch) {
        for (const value of Object.values(patch)) {
          if (typeof value !== 'string') {
            throw new TypeError('Share metadata must be strings')
          }
        }
        return {
          ...context,
          meta: Object.freeze({ ...context.meta, ...patch }),
        }
      }
      return context
    } catch (error) {
      fail(context, 'before-share', error)
    }
  }

  const shareWithBrowser = async (
    context: SocialShareContext,
    requestId: number,
  ) => {
    const isClipboard = context.network.type === 'clipboard'
    const isMarkdown = context.network.clipboardFormat === 'markdown'
    const text = isMarkdown
      ? formatMarkdownLink(context.meta.title, context.meta.url)
      : context.meta.url
    pending.value = true
    try {
      await invokeBrowserShare(context, text)
      if (requestId !== actionRequestId) {
        return
      }
      const copiedKey = isMarkdown ? 'markdownCopied' : 'copied'
      feedbackKey.value = isClipboard ? copiedKey : 'nativeShared'
      publish({ ...context, status: isClipboard ? 'copied' : 'handed-off' })
    } catch (error) {
      if (requestId !== actionRequestId) {
        return
      }
      if (!isClipboard && isAbortError(error)) {
        feedbackKey.value = 'cancelled'
        publish({ ...context, status: 'cancelled' })
        return
      }
      fail(context, 'action', error)
      if (isClipboard) {
        feedbackKey.value = 'copyFailed'
        manualCopyText.value = text
      }
    } finally {
      if (requestId === actionRequestId) {
        pending.value = false
      }
    }
  }

  /**
   * Prepares and executes one share action unless another browser operation is pending.
   * Hook cancellation, browser failures and QR outcomes are published to listeners.
   *
   * @param network - Selected network definition to snapshot and invoke.
   * @returns A Promise that resolves after the action has completed or its failure was reported.
   */
  const share = async (network: SocialShareNetworkWithName) => {
    if (pending.value) {
      return
    }
    const requestId = ++actionRequestId
    feedbackKey.value = undefined
    manualCopyText.value = ''
    const context = prepare(network)
    if (!context) {
      return
    }
    try {
      if (network.type === 'clipboard' || network.type === 'native') {
        await shareWithBrowser(context, requestId)
        return
      }
      if (network.type === 'qrcode') {
        await qrcode.show(context)
        return
      }
      const shareURL = createShareURL(
        network,
        context.meta,
        options.twitterUser,
      )
      if (network.type === 'direct') {
        if (!window.open(shareURL, '_blank')) {
          throw new Error('Share window was blocked')
        }
      } else {
        openSharer(shareURL)
      }
      publish({ ...context, status: 'opened' })
    } catch (error) {
      fail(context, 'action', error)
    }
  }
  return { share, reset, feedback, manualCopyText, pending }
}
