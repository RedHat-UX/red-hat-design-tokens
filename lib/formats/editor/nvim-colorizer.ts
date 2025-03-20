import type { Token } from 'style-dictionary';
import type { Format } from 'style-dictionary/types';

import { isColor, isDeprecatedRGBHSL, not } from '../../predicates.ts';

/**
 * Recursively creates a list of entries matching token names with values
 * @param token token to match against
 */
function pairNameWithVal(token: Token) {
  if (typeof token.$value === 'string') {
    const varName = `--rh-${token.path.filter(x => x !== '_').join('-')}`;
    const refName =
           typeof token.original?.$value === 'string'
        && token.original?.$value?.startsWith('{') ? token.original.$value.replace(/\._}$/, '}')
      : `{${token.path.reduce((a, b) => `${a}.${b}`, '')}}`.replace(/^\{\./, '{');
    const value = token.$value.match(/#\w{6}/)?.pop() ?? token.$value
    if (!value.startsWith('#'))
      return []
    else {
      return [
        [refName, value],
        [varName, value],
      ];
    }
  } else if (token.$value) {
    return Object.fromEntries(Object.entries(token.$value)
        .map(pairNameWithVal));
  } else {
    return [];
  }
}

/**
 * Exports [vim-hexokinase](https://github.com/RRethy/vim-hexokinase)
 * custom patterns for token refs e.g. `{color.gray.90}`
 */
export const nvimColorizer: Format = {
  name: 'editor/neovim/colorizer',
  format: ({ dictionary }) =>
    JSON.stringify(Object.fromEntries(dictionary.allTokens
            .filter(isColor)
            .filter(not(isDeprecatedRGBHSL))
            .flatMap(pairNameWithVal)
            .sort()), null, 2),
};
