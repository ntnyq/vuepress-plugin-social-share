"use strict";
/**
 * @file utils
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNetworksData = exports.getMetaContentByName = exports.inBrowser = exports.isSVG = exports.isExternalUrl = exports.isEmail = void 0;
const constants_1 = require("./constants");
/**
 * Check if given val is valid email address
 * @param val given val
 * @returns `true` if given an email address
 */
const isEmail = (val) => constants_1.RE_EMAIL.test(val);
exports.isEmail = isEmail;
/**
 * Check if the given url is external
 * @param url given url
 * @returns `true` is given an external url
 */
const isExternalUrl = (url) => constants_1.RE_EXTERNAL_LINK.test(url);
exports.isExternalUrl = isExternalUrl;
/**
 * Check if the given source string is SVG
 * @param source given source string
 * @returns `true` if given a svg source string
 */
const isSVG = (source) => constants_1.RE_SVG_SOURCE.test(source);
exports.isSVG = isSVG;
exports.inBrowser = typeof window !== 'undefined';
/**
 * Return meta tag's content in browser by name
 * @param name meta tag's name
 *
 * @returns meta tag's content if exists, or `''`
 */
function getMetaContentByName(name) {
    if (!exports.inBrowser)
        return '';
    const tag = document.getElementsByName(name)[0];
    if (!tag)
        return '';
    return tag.getAttribute(`content`) || ``;
}
exports.getMetaContentByName = getMetaContentByName;
const createNetworksData = (options = {}) => { };
exports.createNetworksData = createNetworksData;
