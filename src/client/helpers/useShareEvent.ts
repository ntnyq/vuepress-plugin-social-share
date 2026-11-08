import { getCurrentInstance } from 'vue'
import type { SocialShareEvent } from '../../shared'

/**
 * Guards listener results before Vue's emit() discards them.
 * Vue retains dispatch, once-listener bookkeeping and development-tool notifications.
 *
 * @param emit - Vue component share-event dispatcher.
 * @returns A dispatcher that logs listener failures and restores original VNode props.
 * @throws {Error} When called outside component setup.
 */
export function useShareEvent(
  emit: (event: SocialShareEvent) => void,
): (event: SocialShareEvent) => void {
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error('Share event listeners must be configured during setup')
  }
  const wrappers = new WeakMap<
    object,
    (event: SocialShareEvent) => Promise<void>
  >()
  const guardListener = (listener: unknown): unknown => {
    if (Array.isArray(listener)) {
      return listener.map(item => guardListener(item))
    }
    if (typeof listener !== 'function') {
      return listener
    }
    const existing = wrappers.get(listener)
    if (existing) {
      return existing
    }
    const guarded = async (event: SocialShareEvent): Promise<void> => {
      try {
        await listener(event)
      } catch (error) {
        console.error('[social-share] Event listener failed:', error)
      }
    }
    wrappers.set(listener, guarded)
    wrappers.set(guarded, guarded)
    return guarded
  }
  return event => {
    const vnode = instance.vnode
    const props = vnode.props
    if (!props) {
      emit(event)
      return
    }
    // Vue can update event-only VNodes without rerendering this component.
    // Guard the current listeners at dispatch time, leaving parent props intact.
    const guardedProps = { ...props }
    for (const key of [
      'onShare-event',
      'onShareEvent',
      'onShare-eventOnce',
      'onShareEventOnce',
    ]) {
      guardedProps[key] = guardListener(props[key])
    }
    vnode.props = guardedProps
    try {
      emit(event)
    } finally {
      vnode.props = props
    }
  }
}
