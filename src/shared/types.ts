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

export type SocialShareQRCodeOptions = QRCodeToDataURLOptions

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
  componentName?: string
  useCustomStyle?: boolean

  networks?: string[]
  twitterUser?: string
  fallbackImage?: string
  isPlain?: boolean
  autoQuote?: boolean
  noGlobalSocialShare?: boolean
  qrcodeOptions?: SocialShareQRCodeOptions
  extendsNetworks?: Record<string, SocialShareNetwork>
  hideWhenPrint?: boolean
}

export interface SocialSharePluginOptionsWithDefaults
  extends Omit<SocialSharePluginOptions, 'componentName' | 'useCustomStyle'> {
  networksData: SocialShareNetworkData
}
