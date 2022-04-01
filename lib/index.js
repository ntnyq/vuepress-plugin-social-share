"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const utils_1 = require("./utils");
const SocialSharePlugin = (options = {}) => {
    const networksData = (0, utils_1.createNetworksData)(options);
    const socialShareOptions = Object.assign(Object.assign({}, options), { networksData });
    return {
        name: `social-share`,
        enhanceAppFiles: (0, path_1.resolve)(__dirname, `enhanceApp.js`),
        clientDynamicModules() {
            return {
                name: `social-share.js`,
                content: `export default ${JSON.stringify(socialShareOptions)}`,
            };
        },
        globalUIComponents: options.noGlobalSocialShare
            ? []
            : [`GlobalSocialShare`],
    };
};
module.exports = SocialSharePlugin;
