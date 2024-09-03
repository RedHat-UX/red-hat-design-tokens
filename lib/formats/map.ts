import type { Dictionary, Format } from 'style-dictionary/types';

import { fileHeader } from 'style-dictionary/utils';

const makeEntries = (dictionary: Dictionary) =>
  dictionary.allTokens.map(x => [`--${x.name}`, x.$value]);

const makeMetaEntries = (dictionary: Dictionary) =>
  dictionary.allTokens.map(x => [`--${x.name}`, x]);

/**
 * JavaScript token map
 * @example ```js
 * import { tokens } from '@rhds/tokens';
 *
 * const fontfamilyCssString = tokens.get('--rh-font-family-body-text');
 * // e.g. 'RedHatText, "Red Hat Text", sans-serif';
 * ```
 */
export const mapEs: Format = {
  name: 'javascript/map',
  async format({ file, dictionary }) {
    return [
      await fileHeader({ file }),
      `export const tokens = new Map(${JSON.stringify(makeEntries(dictionary), null, 2)});`,
    ].join('\n');
  },
};


/**
 * JavaScript token map
 * @example Importing token objects in JavaScript modules
 *          ```js
 *          import { tokens } from '@rhds/tokens/meta.js';
 *
 *          const family = tokens.get('--rh-font-family-body-text');
 *          console.log(family.$description);
 *          // 'The font family used for body text'
 * ```
 */
export const metaMapEs: Format = {
  name: 'javascript/meta-map',
  async format({ file, dictionary }) {
    return [
      await fileHeader({ file }),
      `export const tokens = new Map(${JSON.stringify(makeMetaEntries(dictionary), null, 2)});`,
    ].join('\n');
  },
};


/**
 * CommonJS token map
 * @example ```js
 * const { tokens } = require('@rhds/tokens');
 *
 * const fontfamilyCssString = tokens.get('--rh-font-family-body-text');
 * // e.g. 'RedHatText, "Red Hat Text", sans-serif';
 * ```
 */
export const mapCjs: Format = {
  name: 'javascript/map-cjs',
  format: async (...args) =>
    (await mapEs
        .format(...args) as string)
        .replace('export const tokens', 'exports.tokens'),
};

/**
 * CommonJS token map
 * @example Importing token objects in CommonJS modules
 *          ```js
 *          import { tokens } from '@rhds/tokens/meta.js';
 *
 *          const family = tokens.get('--rh-font-family-body-text');
 *          console.log(family.$description);
 *          // 'The font family used for body text'
 *          ```
 */
export const metaMapCjs: Format = {
  name: 'javascript/meta-map-cjs',
  format: async (...args) =>
    (await metaMapEs
        .format(...args) as string)
        .replace('export const tokens', 'exports.tokens'),
};
