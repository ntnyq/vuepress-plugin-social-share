import { computed, defineComponent, h } from 'vue'
import type { PropType } from 'vue'
import { withBase } from 'vuepress/client'
import { isString, upperFirst } from '../../shared'
import type { SocialShareNetworkWithName } from '../../shared'
import { isSVG } from '../utils'

/**
 * Events emitted by one sharing network button.
 */
export enum Event {
  /**
   * Requests a share action for the clicked network name.
   */
  Share = 'share',
}

/**
 * Renders one network button with a theme-aware icon and accessible labels.
 */
export const SocialShareNetwork = defineComponent({
  /**
   * Vue component name used for debugging and component identification.
   */
  name: 'SocialShareNetwork',

  /**
   * Forwards undeclared attributes to the list item root.
   *
   * @default true
   */
  inheritAttrs: true,

  /**
   * Network configuration and resolved presentation for a single share button.
   */
  props: {
    /**
     * Required named network with an icon and, for link actions, a sharer template.
     */
    network: {
      type: Object as PropType<SocialShareNetworkWithName>,
      required: true,
      /**
       * Checks the fields needed to render and invoke the selected network.
       *
       * @param network - Network definition passed to this button.
       * @returns true when an icon exists and link-based actions have a sharer template.
       */
      validator: (network: SocialShareNetworkWithName) => {
        if (!network.icon) {
          return false
        }
        if (!['qrcode', 'clipboard', 'native'].includes(network.type)) {
          return Boolean(network.sharer)
        }
        return true
      },
    },

    /**
     * Suppresses the network brand color.
     *
     * @default false
     */
    isPlain: {
      type: Boolean,
      default: false,
    },

    /**
     * Selects dark-theme icons and brand colors.
     *
     * @default false
     */
    isDark: {
      type: Boolean,
      default: false,
    },

    /**
     * Prevents clicks while a browser sharing operation is pending.
     *
     * @default false
     */
    disabled: Boolean,
    /**
     * Displays the network label below its icon in the panel grid.
     *
     * @default false
     */
    showLabel: Boolean,
    /**
     * Visible tooltip label; falls back to the capitalized network name.
     *
     * @default undefined
     */
    label: { type: String, default: undefined },
    /**
     * Accessible action label; falls back to Share with followed by the network name.
     *
     * @default undefined
     */
    shareLabel: { type: String, default: undefined },

    /**
     * Expanded sharing URL exposed as button data for link-based networks.
     *
     * @default ''
     */
    shareURL: {
      type: String,
      default: '',
    },
  },

  /**
   * Emits the selected network name when the share button is clicked.
   */
  emits: [Event.Share],

  /**
   * Resolves theme-dependent presentation and creates the share button renderer.
   *
   * @param props - Network definition and resolved appearance settings.
   * @param ctx - Vue setup context used to emit the selected network name.
   * @returns A render function for the network list item and button.
   */
  setup(props, ctx) {
    const resolvedIcon = computed(() => {
      const theme = props.isDark ? 'dark' : 'light'
      const icon = isString(props.network.icon)
        ? props.network.icon
        : props.network.icon[theme]
      return icon.startsWith('/') && !icon.startsWith('//')
        ? withBase(icon)
        : icon
    })
    const resolvedColor = computed(() => {
      if (props.isPlain || !props.network.color) {
        return ''
      }
      if (isString(props.network.color)) {
        return props.network.color
      }
      return props.isDark ? props.network.color.dark : props.network.color.light
    })
    const isSvgIcon = computed(() => isSVG(resolvedIcon.value))

    const renderShareIcon = () =>
      isSvgIcon.value
        ? h('span', {
            class: 'social-share-icon-svg',
            'aria-hidden': 'true',
            focusable: false,
            style: { color: resolvedColor.value },
            innerHTML: resolvedIcon.value,
          })
        : h('span', {
            style: { backgroundImage: `url(${resolvedIcon.value})` },
            class: 'social-share-icon-img',
            'aria-hidden': 'true',
          })
    const renderShareButton = () =>
      h(
        'button',
        {
          class: 'social-share-btn',
          title: props.label ?? upperFirst(props.network.name),
          type: 'button',
          disabled: props.disabled,
          role: 'button',
          'aria-label':
            props.shareLabel ?? `Share with ${upperFirst(props.network.name)}`,
          onClick: () => ctx.emit(Event.Share, props.network.name),
          'data-link':
            props.network.type === 'popup'
              ? `#share-${props.network.name}`
              : props.shareURL,
        },
        [
          renderShareIcon(),
          props.showLabel
            ? h(
                'span',
                { class: 'social-share-label', 'aria-hidden': 'true' },
                props.label ?? upperFirst(props.network.name),
              )
            : null,
        ],
      )

    return () =>
      h(
        'li',
        {
          class: 'social-share-network',
          'data-type': props.network.type,
        },
        [renderShareButton()],
      )
  },
})
