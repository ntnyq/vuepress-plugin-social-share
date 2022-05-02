import { type QRCodeToDataURLOptions } from 'qrcode'

export type MayBe<T> = T | null | undefined

export type SocialShareType = `popup` | `qrcode` | `direct`

export interface SocialShareNetwork {
  sharer?: string
  icon: string
  type: SocialShareType
  color?: string
  action?: string
}

export type SocialShareNetworkItem = SocialShareNetwork & { name: string }

export interface SocialShareNetworkData {
  [key: string]: SocialShareNetwork
}

export type QRCodeOptions = QRCodeToDataURLOptions

export interface SocialSharePluginOptions {
  networks?: string[]
  email?: string
  twitterUser?: string
  fallbackImage?: string
  isPlain?: boolean
  autoQuote?: boolean
  componentName?: string
  noGlobalSocialShare?: boolean
  qrcodeOptions?: QRCodeToDataURLOptions
  extendsNetworks?: Record<string, SocialShareNetwork>
}

export type SocialSharePluginOptionsWithDefaults = Omit<
  SocialSharePluginOptions & {
    networksData: SocialShareNetworkData
  },
  `email`
>
