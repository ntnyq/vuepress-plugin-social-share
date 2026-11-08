import type { SocialShareNetworkWithName } from './network'

/**
 * Resolved metadata for one action. Hook patches never mutate page data.
 */
export interface SocialShareMeta {
  /**
   * Absolute URL of the page being shared.
   */
  url: string
  /**
   * Page title used by share links, Markdown links and system sharing.
   */
  title: string
  /**
   * Page summary supplied to networks that accept descriptive text.
   */
  description: string
  /**
   * Absolute share image URL, or an empty string when no image is available.
   */
  media: string
  /**
   * Quoted text, falling back to the description when autoQuote is enabled.
   */
  quote: string
  /**
   * Comma-separated tags before network-specific formatting.
   */
  hashtags: string
}

/**
 * Readonly snapshots of the selected network and metadata for one share action.
 */
export interface SocialShareContext {
  /**
   * Network configuration captured when the action starts.
   */
  network: Readonly<SocialShareNetworkWithName>
  /**
   * Metadata snapshot, including any synchronous beforeShare patch.
   */
  meta: Readonly<SocialShareMeta>
}

/**
 * Share outcome, with failure details only when status is error.
 * Native sharing reports hand-off rather than delivery to a recipient.
 */
export type SocialShareEvent = SocialShareContext &
  (
    | {
        /**
         * Completed browser effect or cancellation before completion.
         */
        status: 'copied' | 'opened' | 'displayed' | 'handed-off' | 'cancelled'
      }
    | {
        /**
         * Indicates that preparing or executing the share action failed.
         */
        status: 'error'
        /**
         * Whether the failure occurred in the hook or in the browser action.
         */
        stage: 'before-share' | 'action'
        /**
         * Original thrown value or rejected browser API result.
         */
        error: unknown
      }
  )

/**
 * Register functions in client enhance(), rather than build-time plugin options.
 */
export interface SocialShareClientOptions {
  /**
   * Synchronously cancels an action or patches its metadata before browser access.
   * Promises are rejected to preserve the browser's user activation.
   *
   * @param context - Readonly network and metadata snapshots for this action.
   * @returns false to cancel, metadata fields to override, or nothing to continue.
   * @default undefined
   */
  beforeShare?: (
    context: SocialShareContext,
    // oxlint-disable-next-line typescript/no-invalid-void-type -- A synchronous hook may omit its return value.
  ) => false | Partial<SocialShareMeta> | void
  /**
   * Observer return values are ignored; rejected Promises are reported separately.
   *
   * @param event - Share outcome and the snapshots associated with that action.
   * @returns An ignored value; Promise rejections are logged without changing the outcome.
   * @default undefined
   */
  onShareEvent?: (event: SocialShareEvent) => unknown
}
