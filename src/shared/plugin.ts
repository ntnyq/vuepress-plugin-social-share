import type { QRCodeToDataURLOptions } from 'qrcode'
import type { SocialShareLocaleData } from './locale'
import type {
  OverrideSocialShareNetworkWithName,
  SocialShareNetwork,
  SocialShareNetworkWithName,
  ThemeableValue,
} from './network'

/**
 * Legacy registry keyed by network name.
 *
 * @deprecated use `Record<string, SocialShareNetwork>` instead
 * @see SocialShareNetwork
 */
export type SocialShareNetworkData = Record<string, SocialShareNetwork>

/**
 * Page frontmatter consumed by sharing visibility, metadata and option resolution.
 * Share-specific metadata takes precedence over ordinary page metadata.
 */
export interface SocialShareFrontmatter {
  /**
   * Page-specific network and appearance overrides; component props take precedence.
   *
   * @default undefined
   */
  socialShare?: SocialSharePageOptions

  /**
   * Hides the floating sharing toolbar on this page.
   *
   * @default false
   */
  noGlobalSocialShare?: boolean
  /**
   * Hides both inline sharing components and the floating toolbar on this page.
   *
   * @default false
   */
  noSocialShare?: boolean

  /**
   * Highest-priority share description, before shareDescription and description.
   *
   * @default undefined
   */
  $shareDescription?: string
  /**
   * Highest-priority share image, before shareImage, image and fallbackImage.
   *
   * @default undefined
   */
  $shareImage?: string
  /**
   * Highest-priority quoted text, before shareQuote and the autoQuote fallback.
   *
   * @default undefined
   */
  $shareQuote?: string

  /**
   * Highest-priority comma-separated share tags, before shareTags, tags and tag.
   *
   * @default undefined
   */
  $shareTags?: string
  /**
   * Highest-priority share title, before shareTitle, title and the document title.
   *
   * @default undefined
   */
  $shareTitle?: string
  /**
   * Highest-priority share URL, before shareUrl, permalink and the current location.
   *
   * @default undefined
   */
  $shareUrl?: string

  /**
   * Page description used when neither share-specific description is set.
   *
   * @default undefined
   */
  description?: string
  /**
   * Page image used when neither share-specific image is set.
   *
   * @default undefined
   */
  image?: string
  /**
   * Page permalink used when neither share-specific URL is set.
   *
   * @default undefined
   */
  permalink?: string

  /**
   * Share description used after $shareDescription and before description.
   *
   * @default undefined
   */
  shareDescription?: string
  /**
   * Share image used after $shareImage and before image.
   *
   * @default undefined
   */
  shareImage?: string
  /**
   * Quoted text used after $shareQuote and before the autoQuote fallback.
   *
   * @default undefined
   */
  shareQuote?: string

  /**
   * Comma-separated share tags used after $shareTags and before page tags.
   *
   * @default undefined
   */
  shareTags?: string
  /**
   * Share title used after $shareTitle and before the page title.
   *
   * @default undefined
   */
  shareTitle?: string

  /**
   * Share URL used after $shareUrl and before permalink.
   *
   * @default undefined
   */
  shareUrl?: string
  /**
   * Page tag used after tags and before component tags or meta keywords.
   *
   * @default undefined
   */
  tag?: string
  /**
   * Page tags used after share-specific tags and before tag.
   *
   * @default undefined
   */
  tags?: string
  /**
   * Page title used when neither share-specific title is set.
   *
   * @default undefined
   */
  title?: string

  /**
   * Additional VuePress or theme frontmatter fields outside the sharing contract.
   */
  [key: string]: unknown
}

/**
 * QR code renderer options passed to qrcode.toDataURL after merging component defaults.
 *
 * @see {@link https://github.com/soldair/node-qrcode?tab=readme-ov-file#options-2}
 */
export type SocialShareQRCodeOptions = QRCodeToDataURLOptions

/**
 * Build-time configuration for network registration, sharing UI and metadata defaults.
 * Runtime callbacks are configured separately through SocialShareClientOptions.
 */
export interface SocialSharePluginOptions {
  /**
   * Floating toolbar layout with CSS overrides below 768px.
   *
   * @default { position: 'right', direction: 'vertical' }
   */
  globalLayout?: SocialShareGlobalLayout

  /**
   * Partial messages keyed by VuePress locale path; / provides shared overrides.
   * Unspecified fields use built-in English or Simplified Chinese messages.
   *
   * @default {}
   */
  locales?: Record<string, Partial<SocialShareLocaleData>>

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
   * Twitter or X attribution username, without the @ prefix.
   *
   * @default undefined
   */
  twitterUser?: string

  /**
   * Fallback image when page frontmatter provides none. Accepts an HTTP(S) URL
   * or a local path relative to the VuePress public directory.
   *
   * @default undefined
   */
  fallbackImage?: string

  /**
   * Set to `true` to enable plain mode
   *
   * @default false
   */
  isPlain?: boolean

  /**
   * Uses the resolved description as quoted text when no explicit quote is set.
   *
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
   * QR code renderer overrides merged with the component defaults.
   *
   * @default { errorCorrectionLevel: 'H', width: 250, scale: 1, margin: 1.5 }
   * @see https://github.com/soldair/node-qrcode#options
   */
  qrcodeOptions?: SocialShareQRCodeOptions

  /**
   * Additional network definitions or overrides merged into the built-in registry.
   *
   * @default {}
   * @deprecated use {@link SocialSharePluginOptions.networks} instead
   */
  extendsNetworks?: Record<string, SocialShareNetwork>

  /**
   * Set to `true` to hide SocialShare when printing
   *
   * @default false
   */
  hideWhenPrint?: boolean

  /**
   * SVG icon used to expand the floating toolbar, optionally selected by theme.
   * Missing or invalid SVG markup uses the built-in share icon.
   *
   * @default SVG_ICON_SHARE
   */
  shareIcon?: ThemeableValue

  /**
   * SVG icon used to collapse the floating toolbar, optionally selected by theme.
   * Missing or invalid SVG markup uses the built-in close icon.
   *
   * @default SVG_ICON_CLOSE
   */
  shareCloseIcon?: ThemeableValue
}

/**
 * Serialized client configuration after resolving the complete network registry.
 * Build-only registration and styling options are omitted.
 */
export interface SocialSharePluginOptionsWithDefaults extends Omit<
  SocialSharePluginOptions,
  'componentName' | 'networks' | 'extendsNetworks' | 'useCustomStyle'
> {
  /**
   * Complete merged registry, including disabled networks and their default flags.
   */
  networksData: SocialShareNetworkWithName[]
}

/**
 * Per-page overrides. Component props take precedence over these values.
 */
export interface SocialSharePageOptions {
  /**
   * Ordered network names for this page or component; an empty array hides all buttons.
   * Falls back to the plugin-enabled networks when omitted.
   *
   * @default undefined
   */
  networks?: string[]
  /**
   * Overrides plain mode for this page or component; inherits plugin settings when omitted.
   *
   * @default undefined
   */
  isPlain?: boolean
  /**
   * Overrides print visibility for this page or component; inherits plugin settings when omitted.
   *
   * @default undefined
   */
  hideWhenPrint?: boolean
}

/**
 * Orientation of the sharing button list.
 */
export type SocialShareDirection = 'horizontal' | 'vertical'
/**
 * Viewport edge used to anchor the floating toolbar.
 */
export type SocialSharePosition = 'left' | 'right' | 'bottom'

/**
 * Responsive floating toolbar placement. Mobile overrides apply below 768px.
 */
export interface SocialShareGlobalLayout {
  /**
   * Viewport edge used on desktop and inherited by mobile unless overridden.
   *
   * @default 'right'
   */
  position?: SocialSharePosition
  /**
   * Desktop button orientation, inherited by mobile unless overridden.
   *
   * @default 'vertical'
   */
  direction?: SocialShareDirection
  /**
   * Layout overrides for viewports narrower than 768px.
   *
   * @default {}
   */
  mobile?: {
    /**
     * Mobile viewport edge, falling back to the desktop position.
     *
     * @default SocialShareGlobalLayout.position
     */
    position?: SocialSharePosition
    /**
     * Mobile button orientation, falling back to the desktop direction.
     *
     * @default SocialShareGlobalLayout.direction
     */
    direction?: SocialShareDirection
  }
}
