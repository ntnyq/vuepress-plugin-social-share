/**
 * @file types
 */

export type SocialShareType = `popup` | `qrcode`

export interface SocialShareNetwork {
  sharer?: string
  type?: SocialShareType
  color?: string
  icon?: string
  action?: string
}

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
