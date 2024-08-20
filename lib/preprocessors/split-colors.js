// @ts-check
import { readdir } from 'node:fs/promises';

/** @import { DesignToken, DesignTokens, Config } from 'style-dictionary/types'; */

const crayonFiles = await readdir(new URL('../../tokens/color/crayon', import.meta.url));
const CRAYONS = new Set(crayonFiles.map(x => x.replace(/\.ya?ml/, '')));
CRAYONS.add('white');
CRAYONS.add('black');

/**
 * @param {DesignTokens | DesignToken} slice
 * @param {DesignTokens} original
 * @param {Config} opts
 */
function splitColorsRecurse(slice, original, opts) {
  for (const key in slice) {
    const token = slice[key];
    if (typeof token !== 'object' || token === null) {
      continue;
    } else if (token.$extensions?.isCrayon) {
      slice[key] = Object.fromEntries(Object.entries(slice[key] ?? {}).flatMap(([tone, value]) => {
        const color = value.filePath?.split('/').pop().replace(/\.ya?ml/, '');
        if (!CRAYONS.has(color)) {
          return [[tone, value]];
        } else {
          const $value =  `{color.${color}.${tone}}`;
          console.log({ tone, $value})
          return [
            [tone, value],
            [`${tone}-hsl`, {$value}],
            [`${tone}-rgb`, {$value}],
          ];
        }
      }));
    } else {
      splitColorsRecurse(token, original, opts);
    }
  }
}

/** @type {import('style-dictionary/types').Preprocessor}*/
export const splitColors = {
  name: 'split-colors',
  preprocessor(dictionary, opts) {
    // create a copy in which we will do mutations
    const copy = structuredClone(dictionary);
    // create a separate copy to check as the original object
    const original = structuredClone(dictionary);
    splitColorsRecurse(copy, original, opts);
    return copy;
  },
};

