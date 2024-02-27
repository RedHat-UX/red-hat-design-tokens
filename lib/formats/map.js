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
 * @example Importing token objects in JavaScript modules
 *          ```js
 *          import { tokens } from '@rhds/tokens/meta.js';
 *
 *          const family = tokens.get('--rh-font-family-body-text');
 *          console.log(family.$description);
 *          // 'The font family used for body text'
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
 * @example Importing token objects in CommonJS modules
 *          ```js
 *          import { tokens } from '@rhds/tokens/meta.js';
 *
 *          const family = tokens.get('--rh-font-family-body-text');
 *          console.log(family.$description);
 *          // 'The font family used for body text'
 *          ```
 */
export const metaMapCjs = {
  name: 'javascript/meta-map-cjs',
  formatter: (...args) =>
    metaMapEs
      .formatter(...args)
      .replace('export const tokens', 'exports.tokens'),
};


