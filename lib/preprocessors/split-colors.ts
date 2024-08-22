import type { Config, Token, Tokens } from 'style-dictionary';
import type { Preprocessor } from 'style-dictionary/types';

import { readdir } from 'node:fs/promises';

const crayonFiles = await readdir(new URL('../../tokens/color/crayon', import.meta.url));
const CRAYONS = new Set(crayonFiles.map(x => x.replace(/\.ya?ml/, '')));
CRAYONS.add('white');
CRAYONS.add('black');

function splitColorsRecurse(slice: Tokens | Token, opts: Config) {
  for (const key in slice) {
    const token = slice[key];
    if (typeof token !== 'object' || token === null) {
      continue;
    } else if (token.$extensions?.isCrayon) {
      slice[key] = Object.fromEntries(Object.entries(slice[key] ?? {}).flatMap(([tone, value]: [string, Token]) => {
        const color = value.filePath?.split('/').pop().replace(/\.ya?ml/, '');
        if (!CRAYONS.has(color)) {
          return [[tone, {...value}]];
        } else {
          const $value = `{color.${color}.${tone}}`;
          return [
            [tone, {...value}],
            [`${tone}-hsl`, {$value}],
            [`${tone}-rgb`, {$value}],
          ];
        }
      }));
    } else {
      splitColorsRecurse(token, opts);
    }
  }
}

export const splitColors: Preprocessor = {
  name: 'split-colors',
  preprocessor(dictionary, opts) {
    // create a copy in which we will do mutations
    const copy = structuredClone(dictionary);
    splitColorsRecurse(copy, opts);
    return copy;
  },
};

