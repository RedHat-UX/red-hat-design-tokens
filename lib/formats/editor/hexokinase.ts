import type { Token } from 'style-dictionary';
import type { Format } from 'style-dictionary/types';

import { isColor, isDeprecatedRGBHSL, not } from '../../predicates.ts';

/**
 * Recursively creates a list of entries matching token names with values
 * @param token token to match against
 */
function pairRefNameWithValue(token: Token) {
  if (typeof token.$value === 'string') {
    const name =
           typeof token.original?.$value === 'string'
        && token.original?.$value?.startsWith('{') ? token.original.$value.replace(/\._}$/, '}')
      : `{${token.path.reduce((a, b) => `${a}.${b}`, '')}}`.replace(/^\{\./, '{');
    return [[name, token.$value]];
  } else if (token.$value) {
    return Object.fromEntries(Object.entries(token.$value)
        .map(pairRefNameWithValue));
  } else {
    return [];
  }
}

/**
 * Recursively creates a list of entries matching token names with values
 * @param token token to match against
 */
function pairVarNameWithValue(token: Token) {
  if (typeof token.$value === 'string') {
    const name = `--rh-${token.path.filter(x => x !== '_').join('-')}`;
    // console.log(token.$value, token.$value.match(/#\w{6}/));
    return [[name, token.$value.match(/#\w{6}/)?.pop() ?? token.$value]];
  } else if (token.$value) {
    return Object.fromEntries(Object.entries(token.$value)
        .map(pairVarNameWithValue));
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
const COLOR_REF_RE = /{color(\.[\w-]+)+}/;
const COLOR_VAR_RE = /var\(--rh-color(-[\w-]+)+\)/;
const STRIP_SLS_RE = /^\/|\/$/g;

const patternize = (re: RegExp) => re.toString().replace(STRIP_SLS_RE, '');

/**
 * Exports [vim-hexokinase](https://github.com/RRethy/vim-hexokinase)
 * custom patterns for token refs e.g. `{color.gray.90}`
 */
export const hexokinaseRefs: Format = {
  name: 'editor/hexokinase/refs',
  format: ({ dictionary }) =>
    JSON.stringify({
      regex_pattern: patternize(COLOR_REF_RE),
      colour_table: Object.fromEntries(
        dictionary.allTokens
            .filter(isColor)
            .filter(not(isDeprecatedRGBHSL))
            .flatMap(pairRefNameWithValue)
            .sort()),
    }, null, 2),
};

/**
 * Exports [vim-hexokinase](https://github.com/RRethy/vim-hexokinase)
 * custom patterns for token refs e.g. `{color.gray.90}`
 */
export const hexokinaseVars: Format = {
  name: 'editor/hexokinase/vars',
  format: ({ dictionary }) =>
    JSON.stringify({
      regex_pattern: patternize(COLOR_VAR_RE),
      colour_table: Object.fromEntries(
        dictionary.allTokens
            .filter(isColor)
            .filter(not(isDeprecatedRGBHSL))
            .flatMap(pairVarNameWithValue)
            .sort()),
    }, null, 2),
};
