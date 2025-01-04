/**
 * @file types
 */

import type { QRCodeToDataURLOptions } from 'qrcode'

export type MayBe<T> = T | null | undefined

export const socialShareType = ['popup', 'qrcode', 'direct'] as const

export type QRCodeOptions = QRCodeToDataURLOptions

export interface SocialShareNetwork {
  action?: string
  color?: string
  icon?: string
  sharer?: string
  type?: SocialShareType
}

export type SocialShareNetworkData = Record<string, SocialShareNetwork>

export type SocialShareNetworkItem = SocialShareNetwork & { name: string }

export interface SocialSharePluginOptions {
  autoQuote?: boolean
  email?: string
  extendsNetworks?: Record<string, SocialShareNetwork>
  fallbackImage?: string
  isPlain?: boolean
  networks?: string[]
  noGlobalSocialShare?: boolean
  qrcodeOptions?: QRCodeToDataURLOptions
  twitterUser?: string
}

export type SocialShareType = (typeof socialShareType)[number]
