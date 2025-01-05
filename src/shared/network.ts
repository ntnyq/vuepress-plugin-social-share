import type { BuiltInNetworkNames } from './constants.js'

/**
 * Themeable value
 */
export type ThemeableValue<T = string> = T | { light: T; dark: T }

/**
 * Social share network
 */
export interface SocialShareNetwork {
  /**
   * Sharer icon
   */
  icon: ThemeableValue

  /**
   * Sharer type
   */
  type: 'direct' | 'popup' | 'qrcode'

  /**
   * Sharer icon color
   */
  color?: ThemeableValue

  /**
   * Sharer URL
   */
  sharer?: string

  /**
   * If component `SocialShare` has no prop `networks`, all `default: true` network will show
   */
  default?: boolean
}

/**
 * @deprecated use {@link SocialShareNetworkWithName} instead
 */
export type SocialShareNetworkItem = SocialShareNetworkWithName

/**
 * Social share network with name
 */
export type SocialShareNetworkWithName = SocialShareNetwork & {
  /**
   * Sharer name
   */
  name: string
}

/**
 * Override social share network with name
 */
export type OverrideSocialShareNetworkWithName = Partial<SocialShareNetwork> & {
  /**
   * Built-in share name
   */
  name: BuiltInNetworkNames
}
