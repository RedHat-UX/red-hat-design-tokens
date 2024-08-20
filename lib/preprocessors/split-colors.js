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
    }
    let value = token.$value;
    if (value && typeof value === 'object' && value.$extensions?.isCrayon) {
        slice[key] = {
          ...value,
          ...Object.fromEntries(Object.entries(value ?? {}).map(([color, tones]) => {
              if (!CRAYONS.has(color)) {
                return [color, tones];
              } else {
                const all = Object.keys(tones)
                .flatMap(tone => {
                  const $value = `{color.${color}.${tone}}`;
                  const $type = 'color';
                  return [
                    [tone, tones[tone]],
                    ...tone.match(/^(\$|attributes|value)/) ? [] : [
                      [`${tone}-hsl`, { $type, $value }],
                      [`${tone}-rgb`, { $type, $value }],
                    ]
                  ];
                });
                return [color, Object.fromEntries(all)];
              }
            })),
        };
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

