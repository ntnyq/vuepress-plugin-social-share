import type { BuiltInNetworkNames } from './constants'

/**
 * Value shared by both themes or configured independently for each theme.
 *
 * @template [T=string] - Value type used by both themes.
 */
export type ThemeableValue<T = string> =
  | T
  | {
      /**
       * Value selected in light mode.
       */
      light: T
      /**
       * Value selected in dark mode.
       */
      dark: T
    }

/**
 * Share action definition with presentation and browser dispatch settings.
 * Link-based actions require a sharer template; other actions use browser APIs
 * or a generated QR overlay.
 */
export interface SocialShareNetwork {
  /**
   * SVG markup or image URL, optionally selected by the current theme.
   */
  icon: ThemeableValue

  /**
   * Browser effect used to share: navigation, popup, QR overlay, clipboard or system UI.
   */
  type: 'direct' | 'popup' | 'qrcode' | 'clipboard' | 'native'

  /**
   * Content copied by a clipboard network.
   *
   * @default 'url'
   */
  clipboardFormat?: 'url' | 'markdown'

  /**
   * SVG icon color, optionally selected by theme; ignored in plain mode.
   *
   * @default undefined
   */
  color?: ThemeableValue

  /**
   * Share URL template with placeholders such as @url, @title and @description.
   * Required by direct and popup networks.
   *
   * @default undefined
   */
  sharer?: string

  /**
   * Enables this network when no component or page network list overrides it.
   * String entries in plugin networks also enable the corresponding network.
   *
   * @default false
   */
  default?: boolean
}

/**
 * Legacy alias for a named network configuration.
 *
 * @deprecated use {@link SocialShareNetworkWithName} instead
 */
export type SocialShareNetworkItem = SocialShareNetworkWithName

/**
 * Complete network definition with its stable registry key.
 */
export type SocialShareNetworkWithName = SocialShareNetwork & {
  /**
   * Registry key used in network lists, locale labels and share events.
   */
  name: string
}

/**
 * Partial overrides targeting one of the built-in network registry keys.
 */
export type OverrideSocialShareNetworkWithName = Partial<SocialShareNetwork> & {
  /**
   * Built-in registry key whose presentation or action settings are overridden.
   */
  name: BuiltInNetworkNames
}
