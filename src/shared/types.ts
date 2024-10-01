import type { QRCodeToDataURLOptions } from 'qrcode'

export type SocialShareType = 'popup' | 'qrcode' | 'direct'

export interface SocialShareNetwork {
  type: SocialShareType
  icon: string
  sharer?: string
  color?: string
}

export type SocialShareNetworkItem = SocialShareNetwork & { name: string }

export type SocialShareNetworkData = Record<string, SocialShareNetwork>

/**
 * QRCode options, alias of `QRCodeToDataURLOptions`
 *
 * @see {@link https://github.com/soldair/node-qrcode?tab=readme-ov-file#options-2}
 */
export type SocialShareQRCodeOptions = QRCodeToDataURLOptions

export type SocialShareFrontmatter = {
  noSocialShare?: boolean
  noGlobalSocialShare?: boolean

  // share meta
  shareUrl?: string
  $shareUrl?: string
  permalink?: string

  title?: string
  shareTitle?: string
  $shareTitle?: string

  description?: string
  shareDescription?: string
  $shareDescription?: string

  image?: string
  shareImage?: string
  $shareImage?: string

  shareQuote?: string
  $shareQuote?: string

  tag?: string
  tags?: string
  shareTags?: string
  $shareTags?: string
}

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
   */
  extendsNetworks?: SocialShareNetworkData

  /**
   * Set to `true` to hide SocialShare when printing
   *
   * @default false
   */
  hideWhenPrint?: boolean
}

export interface SocialSharePluginOptionsWithDefaults
  extends Omit<SocialSharePluginOptions, 'componentName' | 'useCustomStyle'> {
  networksData: SocialShareNetworkData
}
