/**
 * @file types
 */

import type { QRCodeToDataURLOptions } from 'qrcode'

export type MayBe<T> = T | null | undefined

export type SocialShareType = 'popup' | 'qrcode' | 'direct'

export interface SocialShareNetwork {
  sharer?: string
  type?: SocialShareType
  color?: string
  icon?: string
  action?: string
}

export type QRCodeOptions = QRCodeToDataURLOptions

export type SocialShareNetworkItem = SocialShareNetwork & { name: string }

export type SocialShareNetworkData = Record<string, SocialShareNetwork>

export interface SocialSharePluginOptions {
  networks?: string[]
  email?: string
  twitterUser?: string
  fallbackImage?: string
  isPlain?: boolean
  autoQuote?: boolean
  qrcodeOptions?: QRCodeToDataURLOptions
  noGlobalSocialShare?: boolean
  extendsNetworks?: Record<string, SocialShareNetwork>
}
