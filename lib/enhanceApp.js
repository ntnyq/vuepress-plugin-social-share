"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./style.styl");
// @ts-expect-error virtual modules
const social_share_1 = __importDefault(require("@dynamic/social-share"));
const SocialShare_1 = __importDefault(require("./components/SocialShare"));
const GlobalSocialShare_1 = __importDefault(require("./components/GlobalSocialShare"));
const enhanceApp = ({ Vue }) => {
    const { networks, twitterUser, fallbackImage, autoQuote, isPlain, networksData, } = social_share_1.default;
    Vue.component(`SocialShare`, {
        functional: true,
        props: {
            networks: {
                type: Array,
            },
            tags: {
                type: Array,
            },
            isPlain: {
                type: Boolean,
            },
        },
        render(h, { props, data, parent }) {
            // @ts-expect-error private property
            if (parent._isMounted) {
                return h(SocialShare_1.default, Object.assign(Object.assign({}, data), { props: {
                        networks: props.networks || networks,
                        tags: props.tags,
                        twitterUser,
                        fallbackImage,
                        autoQuote,
                        isPlain: props.isPlain || isPlain,
                        networksData,
                    } }));
            }
            else {
                parent.$once(`hook:mounted`, () => {
                    parent.$forceUpdate();
                });
                return h();
            }
        },
    });
    Vue.component(`GlobalSocialShare`, {
        functional: true,
        render(h, { parent }) {
            // @ts-expect-error private property
            if (parent._isMounted) {
                return h(GlobalSocialShare_1.default, {
                    attrs: {
                        networks,
                        isPlain,
                        twitterUser,
                        fallbackImage,
                        autoQuote,
                        networksData,
                    },
                });
            }
            else {
                parent.$once(`hook:mounted`, () => {
                    parent.$forceUpdate();
                });
                return h();
            }
        },
    });
};
module.exports = enhanceApp;
