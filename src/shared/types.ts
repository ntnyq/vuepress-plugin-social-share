import type { QRCodeToDataURLOptions } from 'qrcode'

export type SocialShareNetworkData = Record<string, SocialShareNetwork>

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
 * Social share network
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
export interface SocialShareNetwork {
  icon: SocilaShareIcon
  type: SocialShareType
  color?: SocialShareColor
  sharer?: string
}
export type SocialShareType = 'direct' | 'popup' | 'qrcode'
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
 * Front-matter
 */
export type SocialShareFrontmatter = {
  noGlobalSocialShare?: boolean
  noSocialShare?: boolean

  // share meta
  $shareDescription?: string
  $shareImage?: string
  $shareQuote?: string

  $shareTags?: string
  $shareTitle?: string
  $shareUrl?: string

  description?: string
  image?: string
  permalink?: string

  shareDescription?: string
  shareImage?: string
  shareQuote?: string

  shareTags?: string
  shareTitle?: string

  shareUrl?: string
  tag?: string
  tags?: string
  title?: string
}

/**
 * QRCode options, alias of `QRCodeToDataURLOptions`
 *
 * @see {@link https://github.com/soldair/node-qrcode?tab=readme-ov-file#options-2}
 */
export type SocialShareQRCodeOptions = QRCodeToDataURLOptions

/**
 * Plugin options
 */
export interface SocialSharePluginOptions {
  /**
   * Custom component name of `SocialShare`
   *
   * @default 'SocialShare'
   */
  componentName?: string

  /**
   * Set to `true` to disable built-in style
   *
   * @default false
   */
  useCustomStyle?: boolean

  /**
   * Default networks set for all your social share components
   *
   * @default ['twitter', 'facebook', 'reddit']
   */
  networks?: string[]

  /**
   * Twitter profile username
   */
  twitterUser?: string

  /**
   * A fallback share image. A network image URL or a local image path based on `/public`
   */
  fallbackImage?: string

  /**
   * Set to `true` to enable plain mode
   *
   * @default false
   */
  isPlain?: boolean

  /**
   * @default true
   */
  autoQuote?: boolean

  /**
   * Set to `true` to disable global social share
   *
   * @default false
   */
  noGlobalSocialShare?: boolean

  /**
   * QRCode options
   * @see {@link https://github.com/soldair/node-qrcode?tab=readme-ov-file#options-2}
   */
  qrcodeOptions?: SocialShareQRCodeOptions

  /**
   * Add user customed networks or overrides built-in networks
   *
   * @deprecated use {@link networks} instead
   */
  extendsNetworks?: SocialShareNetworkData

  /**
   * Set to `true` to hide SocialShare when printing
   *
   * @default false
   */
  hideWhenPrint?: boolean
}

/**
 * Plugin options with networksData
 */
export interface SocialSharePluginOptionsWithDefaults
  extends Omit<SocialSharePluginOptions, 'componentName' | 'useCustomStyle'> {
  networksData: SocialShareNetworkData
}
