"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const SocialShare = {
    name: `SocialShare`,
    props: {
        networks: {
            type: Array,
            default: () => [`twitter`, `facebook`, `reddit`],
        },
        tags: {
            type: Array,
            default: () => [],
        },
        twitterUser: {
            type: String,
        },
        fallbackImage: {
            type: String,
        },
        autoQuote: {
            type: Boolean,
            default: true,
        },
        isPlain: {
            type: Boolean,
            default: false,
        },
        networksData: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        visible() {
            return this.networks.length && !this.$frontmatter.noSocialShare;
        },
        url() {
            return (this.$frontmatter.$shareUrl ||
                this.$frontmatter.shareUrl ||
                (utils_1.inBrowser ? location.href : ''));
        },
        title() {
            return (this.$frontmatter.$shareTitle ||
                this.$frontmatter.shareTitle ||
                this.$frontmatter.title ||
                (utils_1.inBrowser ? document.title : this.$title));
        },
        description() {
            return (this.$frontmatter.$shareDescription ||
                this.$frontmatter.shareDescription ||
                this.$frontmatter.description ||
                (0, utils_1.getMetaContentByName)('description') ||
                this.$description);
        },
        media() {
            const mediaUrl = this.$frontmatter.$shareImage ||
                this.$frontmatter.shareImage ||
                this.$frontmatter.image ||
                this.fallbackImage;
            if (!mediaUrl)
                return '';
            if ((0, utils_1.isExternalUrl)(mediaUrl))
                return mediaUrl;
            const realUrl = utils_1.inBrowser
                ? `${location.origin}${this.$withBase(mediaUrl)}`
                : '';
            return realUrl;
        },
        quote() {
            return (this.$frontmatter.$shareQuote ||
                this.$frontmatter.shareQuote ||
                (this.autoQuote ? this.description : ''));
        },
        hashtags() {
            const shareTags = this.$frontmatter.$shareTags ||
                this.$frontmatter.shareTags ||
                this.$frontmatter.tags ||
                this.$frontmatter.tag ||
                this.tags ||
                (0, utils_1.getMetaContentByName)('keywords');
            if (Array.isArray(shareTags)) {
                return shareTags.join(',');
            }
            if (typeof shareTags === 'string') {
                return shareTags.replace(/\s/g, '');
            }
            return '';
        },
    },
    render(h) {
        return h(`div`, { attrs: { class: 'social-share' } }, []);
    },
};
exports.default = SocialShare;
