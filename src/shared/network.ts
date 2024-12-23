/**
 * network color
 */
export type SocialShareColor =
  | string
  | {
      /**
       * color for dark mode
       */
      dark: string
      /**
       * color for light mode
       */
      light: string
    }

/**
 * network type
 */
export type SocialShareType = 'direct' | 'popup' | 'qrcode'

/**
 * network icon
 */
export type SocilaShareIcon =
  | string
  | {
      /**
       * icon for dark mode
       */
      dark: string
      /**
       * icon for light mode
       */
      light: string
    }

/**
 * Social share network
 */
export interface SocialShareNetwork {
  icon: SocilaShareIcon
  type: SocialShareType
  color?: SocialShareColor
  sharer?: string
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
