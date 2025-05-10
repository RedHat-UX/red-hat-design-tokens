import type { Config, Token, Tokens } from 'style-dictionary';
import type { Preprocessor } from 'style-dictionary/types';

import { readdir } from 'node:fs/promises';

const crayonFiles = await readdir(new URL('../../tokens/color/crayon', import.meta.url));
const CRAYONS = new Set(crayonFiles.map(x => x.replace(/\.ya?ml/, '')));
CRAYONS.add('white');
CRAYONS.add('black');

function splitColorsRecurse(slice: Tokens | Token, opts: Config) {
  for (const key in slice) {
    if (Object.prototype.hasOwnProperty.call(slice, key)) {
      const token = slice[key];
      if (typeof token !== 'object' || token === null) {
        continue;
      } else if (key === 'white' || key === 'black') {
        const $value = `{color.${key}}`;
        slice[`${key}-hsl`] = { $value };
        slice[`${key}-rgb`] = { $value };
      } else if (token.$extensions?.isCrayon) {
        for (const tkey in token) {
          if (token[tkey]?.$value) {
            const $value = `{color.${key}.${tkey}}`;
            const tname = `--rh-color-${key}-${tkey}`;
            token[`${tkey}-hsl`] = { $value, $deprecated: `Use color transforms instead e.g. hsla(from var(${tname}) h s l / 10%)` };
            token[`${tkey}-rgb`] = { $value, $deprecated: `Use color transforms instead e.g. rgba(from var(${tname}) r g b / 10%)` };
          }
        }
      } else if (typeof token === 'object') {
        splitColorsRecurse(token, opts);
      } else {
        continue;
      }
    }
  }
}

/** Splits color tokens it finds, generating `-rgb` and `-hsl` variants */
export const splitColors: Preprocessor = {
  name: 'split-colors',
  async preprocessor(dictionary, opts) {
    // create a copy in which we will do mutations
    const copy = structuredClone(dictionary);
    splitColorsRecurse(copy, opts);
    return copy;
  },
};
