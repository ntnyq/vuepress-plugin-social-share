import type { QRCodeToDataURLOptions } from 'qrcode'
import type {
  OverrideSocialShareNetworkWithName,
  SocialShareNetwork,
  SocialShareNetworkWithName,
} from './network.js'

/**
 * @deprecated use `Record<string, SocialShareNetwork>` instead
 *
 * @see {@link SocialShareNetwork}
 */
export type SocialShareNetworkData = Record<string, SocialShareNetwork>

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
  networks?: (
    | string
    | SocialShareNetworkWithName
    | OverrideSocialShareNetworkWithName
  )[]

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
  extendsNetworks?: Record<string, SocialShareNetwork>

  /**
   * Set to `true` to hide SocialShare when printing
   *
   * @default false
   */
  hideWhenPrint?: boolean
}

/**
 * Client options with networksData
 */
export interface SocialSharePluginOptionsWithDefaults
  extends Omit<
    SocialSharePluginOptions,
    'componentName' | 'networks' | 'extendsNetworks' | 'useCustomStyle'
  > {
  networksData: SocialShareNetworkWithName[]
}
