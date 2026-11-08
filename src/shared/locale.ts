/**
 * Plain-text messages. `{network}` is interpolated without interpreting HTML.
 * Missing overrides inherit EN_LOCALE or ZH_CN_LOCALE according to page language.
 */
export interface SocialShareLocaleData {
  /**
   * Accessible share button label; {network} is replaced with the network label.
   */
  shareWith: string
  /**
   * Accessible label for the collapsed toolbar trigger.
   */
  expand: string
  /**
   * Accessible label for the expanded toolbar trigger.
   */
  collapse: string
  /**
   * Status message after copying a URL to the clipboard.
   */
  copied: string
  /**
   * Status message after copying a Markdown link.
   */
  markdownCopied: string
  /**
   * Clipboard failure message and accessible label for manual copy text.
   */
  copyFailed: string
  /**
   * Status message when preparing or executing a share action fails.
   */
  shareFailed: string
  /**
   * Status message after the browser hands content to system sharing.
   */
  nativeShared: string
  /**
   * Status message after a hook or system sharing dialog cancels the action.
   */
  cancelled: string
  /**
   * Alternative text for the generated QR code image.
   */
  qrcodeAlt: string
  /**
   * Label for the button that closes the QR code dialog.
   */
  qrcodeClose: string
  /**
   * Network display labels keyed by registry name; missing labels use a capitalized name.
   */
  networkLabels: Record<string, string>
}

/**
 * Built-in English messages and action labels used by default for non-Chinese locales.
 */
export const EN_LOCALE: SocialShareLocaleData = {
  /**
   * Accessible share button label; {network} is replaced with the network label.
   */
  shareWith: 'Share with {network}',
  /**
   * Accessible label for the collapsed toolbar trigger.
   */
  expand: 'Show sharing options',
  /**
   * Accessible label for the expanded toolbar trigger.
   */
  collapse: 'Hide sharing options',
  /**
   * Status message after copying a URL to the clipboard.
   */
  copied: 'Link copied',
  /**
   * Status message after copying a Markdown link.
   */
  markdownCopied: 'Markdown link copied',
  /**
   * Clipboard failure message and accessible label for manual copy text.
   */
  copyFailed: 'Copy failed. Select the text and copy it manually.',
  /**
   * Status message when preparing or executing a share action fails.
   */
  shareFailed: 'Unable to share. Please try again.',
  /**
   * Status message after the browser hands content to system sharing.
   */
  nativeShared: 'Handed off to system sharing',
  /**
   * Status message after a hook or system sharing dialog cancels the action.
   */
  cancelled: 'Sharing cancelled',
  /**
   * Alternative text for the generated QR code image.
   */
  qrcodeAlt: 'QR code for sharing this page',
  /**
   * Label for the button that closes the QR code dialog.
   */
  qrcodeClose: 'Close QR code',
  /**
   * Network display labels keyed by registry name; missing labels use a capitalized name.
   */
  networkLabels: {
    /**
     * Label for copying the page URL.
     */
    copy: 'Copy link',
    /**
     * Label for copying the page as a Markdown link.
     */
    'copy-markdown': 'Copy Markdown link',
    /**
     * Label for opening the system sharing dialog.
     */
    native: 'System share',
  },
}

/**
 * Built-in Simplified Chinese messages for zh, zh-CN, zh-SG and zh-Hans languages.
 */
export const ZH_CN_LOCALE: SocialShareLocaleData = {
  /**
   * Accessible share button label; {network} is replaced with the network label.
   */
  shareWith: '分享到 {network}',
  /**
   * Accessible label for the collapsed toolbar trigger.
   */
  expand: '展开分享',
  /**
   * Accessible label for the expanded toolbar trigger.
   */
  collapse: '收起分享',
  /**
   * Status message after copying a URL to the clipboard.
   */
  copied: '链接已复制',
  /**
   * Status message after copying a Markdown link.
   */
  markdownCopied: 'Markdown 链接已复制',
  /**
   * Clipboard failure message and accessible label for manual copy text.
   */
  copyFailed: '复制失败，请选中文本后手动复制',
  /**
   * Status message when preparing or executing a share action fails.
   */
  shareFailed: '暂时无法分享，请重试',
  /**
   * Status message after the browser hands content to system sharing.
   */
  nativeShared: '已交给系统分享',
  /**
   * Status message after a hook or system sharing dialog cancels the action.
   */
  cancelled: '分享已取消',
  /**
   * Alternative text for the generated QR code image.
   */
  qrcodeAlt: '当前页面的分享二维码',
  /**
   * Label for the button that closes the QR code dialog.
   */
  qrcodeClose: '关闭二维码',
  /**
   * Network display labels keyed by registry name; missing labels use a capitalized name.
   */
  networkLabels: {
    /**
     * Label for copying the page URL.
     */
    copy: '复制链接',
    /**
     * Label for copying the page as a Markdown link.
     */
    'copy-markdown': '复制 Markdown 链接',
    /**
     * Label for opening the system sharing dialog.
     */
    native: '系统分享',
  },
}
