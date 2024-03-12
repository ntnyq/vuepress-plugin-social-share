import type { QRCodeToDataURLOptions } from 'qrcode'

export type SocialShareType = 'popup' | 'qrcode' | 'direct'

export interface SocialShareNetwork {
  sharer?: string
  icon: string
  type: SocialShareType
  color?: string
}

export type SocialShareNetworkItem = SocialShareNetwork & { name: string }

export type SocialShareNetworkData = Record<string, SocialShareNetwork>

export type QRCodeOptions = QRCodeToDataURLOptions

export interface SocialShareFrontmatter {
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
  networks?: string[]
  twitterUser?: string
  fallbackImage?: string
  isPlain?: boolean
  autoQuote?: boolean
  componentName?: string
  useCustomStyle?: boolean
  noGlobalSocialShare?: boolean
  qrcodeOptions?: QRCodeToDataURLOptions
  extendsNetworks?: Record<string, SocialShareNetwork>
  hideWhenPrint?: boolean
}

export interface SocialSharePluginOptionsWithDefaults
  extends Omit<SocialSharePluginOptions, 'componentName' | 'useCustomStyle'> {
  networksData: SocialShareNetworkData
}
