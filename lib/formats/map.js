import StyleDictionary from 'style-dictionary';
const { fileHeader } = StyleDictionary.formatHelpers;

const makeEntries = dictionary => dictionary.allTokens.map(x => [`--${x.name}`, x.value]);

const makeMetaEntries = dictionary => dictionary.allTokens.map(x => [`--${x.name}`, x]);

/**
 * JavaScript token map
 * @type {import('style-dictionary').Format}
 * @example ```js
 * import { tokens } from '@rhds/tokens';
 *
 * const fontfamilyCssString = tokens.get('--rh-font-family-body-text');
 * // e.g. 'RedHatText, "Red Hat Text", sans-serif';
 * ```
 */
export const mapEs = {
  name: 'javascript/map',
  formatter({ file, dictionary }) {
    return [
      fileHeader({ file }),
      `export const tokens = new Map(${JSON.stringify(makeEntries(dictionary), null, 2)});`,
    ].join('\n');
  },
};


/**
 * JavaScript token map
 * @type {import('style-dictionary').Format}
 * @example ```js
 * import { tokensMeta } from '@rhds/tokens/meta.js';
 *
 * const fontfamilyCssString = tokensMeta.get('--rh-font-family-body-text');
 * // e.g. '{
 * value: 'RedHatText, "Red Hat Text", sans-serif',
 * description: 'The font family used for body text',
 * extensions: ''
 * }';
 * ```
 */
export const metaMapEs = {
  name: 'javascript/meta-map',
  formatter({ file, dictionary }) {
    return [
      fileHeader({ file }),
      `export const tokens = new Map(${JSON.stringify(makeMetaEntries(dictionary), null, 2)});`,
    ].join('\n');
  },
};


/**
 * CommonJS token map
 * @type {import('style-dictionary').Format}
 * @example ```js
 * const { tokens } = require('@rhds/tokens');
 *
 * const fontfamilyCssString = tokens.get('--rh-font-family-body-text');
 * // e.g. 'RedHatText, "Red Hat Text", sans-serif';
 * ```
 */
export const mapCjs = {
  name: 'javascript/map-cjs',
  formatter: (...args) =>
    mapEs
      .formatter(...args)
      .replace('export const tokens', 'exports.tokens'),
};

/**
 * CommonJS token map
 * @type {import('style-dictionary').Format}
 * @example ```js
 * const { tokensMeta } = require('@rhds/tokens/meta.js');
 *
 * const fontfamilyCssString = tokensMeta.get('--rh-font-family-body-text');
 * // e.g. '{
 * value: 'RedHatText, "Red Hat Text", sans-serif',
 * description: 'The font family used for body text',
 * extensions: ''
 * }';
 * ```
 */
export const metaMapCjs = {
  name: 'javascript/meta-map-cjs',
  formatter: (...args) =>
    metaMapEs
      .formatter(...args)
      .replace('export const tokens', 'exports.tokens'),
};


