import type { Token } from 'style-dictionary';
import type { Format } from 'style-dictionary/types';

import { isColor } from '../predicates.ts';

/**
 * Recursively creates a list of entries matching token names with values
 * @param token token to match against
 */
function pairAliasWithValue(token: Token) {
  if (typeof token.$value === 'string') {
    const name =
        token.original?.$value?.startsWith('{') ? token.original.$value.replace(/\._}$/, '}')
      : `{${token.path.reduce((a, b) => `${a}.${b}`, '')}}`.replace(/^\{\./, '{');
    return [[name, token.$value]];
  } else if (token.$value) {
    return Object.fromEntries(Object.entries(token.$value)
        .map(pairAliasWithValue));
  } else {
    return [];
  }
}

/**
 * `{color.`
 * capture group 1: **WORD** (_>= 1x_)
 * `.`
 * capture group 2: **0-9** (_1-3x_)
 * `}`
 */
const COLOR_TOKEN_RE = /{color\.(\w+)\.(\d{1,3})}/;

/**
 * Exports [vim-hexokinase](https://github.com/RRethy/vim-hexokinase) custom patterns
 */
export const hexokinase: Format = {
  name: 'editor/hexokinase',
  format: ({ dictionary }) =>
    JSON.stringify({
      regex_pattern: COLOR_TOKEN_RE.toString().replace(/^\/|\/$/, ''),
      colour_table: Object.fromEntries(
        dictionary.allTokens
            .filter(isColor)
            .flatMap(pairAliasWithValue)
            .sort()),
    }, null, 2),
};
