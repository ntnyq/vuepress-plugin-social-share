import { inject } from 'vue'
import type { App, InjectionKey } from 'vue'
import type { SocialShareClientOptions } from '../../shared'

/**
 * App-scoped injection key for runtime share hooks.
 */
const clientOptionsKey: InjectionKey<SocialShareClientOptions> = Symbol(
  'social-share-client-options',
)

/**
 * Registers runtime hooks for one Vue app during client enhance(), before mount.
 *
 * @param app - Vue application that owns the hooks.
 * @param options - Synchronous preparation hook and share outcome observer.
 * @returns Nothing; provides the hooks to descendant sharing components.
 */
export function configureSocialShare(
  app: App,
  options: SocialShareClientOptions,
): void {
  app.provide(clientOptionsKey, options)
}

/**
 * Reads runtime hooks from the current component injection context.
 *
 * @returns Registered client hooks, or an empty object when none were configured.
 */
export function useSocialShareClientOptions(): SocialShareClientOptions {
  return inject(clientOptionsKey, {})
}
