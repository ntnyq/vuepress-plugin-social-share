/**
 * @file types
 */

export type SocialShareType = `popup` | `qrcode` | `direct`

export interface SocialShareNetwork {
  sharer?: string
  type?: SocialShareType
  color?: string
  icon?: string
  action?: string
}

export type SocialShareNetworkItem = SocialShareNetwork & { name: string }

export interface SocialShareNetworkData {
  [key: string]: SocialShareNetwork
}

export interface SocialSharePluginOptions {
  networks?: string[]
  email?: string
  twitterUser?: string
  fallbackImage?: string
  isPlain?: boolean
  autoQuote?: boolean
  noGlobalSocialShare?: boolean
  extendsNetworks?: any
}