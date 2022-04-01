/**
 * @file utils
 */
import type { SocialSharePluginOptions } from './types';
/**
 * Check if given val is valid email address
 * @param val given val
 * @returns `true` if given an email address
 */
export declare const isEmail: (val: string) => boolean;
/**
 * Check if the given url is external
 * @param url given url
 * @returns `true` is given an external url
 */
export declare const isExternalUrl: (url: string) => boolean;
/**
 * Check if the given source string is SVG
 * @param source given source string
 * @returns `true` if given a svg source string
 */
export declare const isSVG: (source: string) => boolean;
export declare const inBrowser: boolean;
/**
 * Return meta tag's content in browser by name
 * @param name meta tag's name
 *
 * @returns meta tag's content if exists, or `''`
 */
export declare function getMetaContentByName(name: string): string;
export declare const createNetworksData: (options?: SocialSharePluginOptions) => void;
