import { isColor } from '../predicates.ts';

/** @typedef {import('style-dictionary').Format} Format */

/** Creates a list of entries matching token names with values */
function pairAliasWithValue(token) {
  if (typeof token.value === 'string') {
    const name = token.original?.value?.startsWith('{') ? token.original.value.replace(/\._}$/, '}') : `{${token.path.reduce((a, b) => `${a}.${b}`, '')}}`.replace(/^\{\./, '{');
    return [[name, token.value]];
  } else if (token.value) {
    return Object.fromEntries(Object.entries(token.value).map(pairAliasWithValue));
  } else {
    return [];
  }
}

/**
 * Exports VSCode-style snippets for editor support
 * @type {Format}
 */
export const vscodeSnippets = {
  name: 'editor/snippets/vscode',
  format: ({ dictionary }) =>
    JSON.stringify(Object.fromEntries(
      dictionary.allTokens.map(token => {
        return [
          token.title ?? token.name,
          {
            scope: 'css,scss',
            prefix: [
              // `--${token.name}`,
              token.name.replaceAll('-', ''),
              token.value?.startsWith?.('#') ? token.value.replace(/^#/, '') : null
            ].filter(Boolean),
            body: [`var(--${token.name}\${1:, ${token.value}})$2`],
            description: token.$description,
          },
        ];
      })), null, 2),
};

/**
 * Exports textmate-style snippets for editor support
 * @type {Format}
 * @example ```snippets
 * snippet --rh-color-black
 *   var(--rh-color-black, #000)
 * ```
 */
export const textmateSnippets = {
  name: 'editor/snippets/textmate',
  format: ({ dictionary }) =>
  //     dictionary.allTokens.reduce((snippets, token) => `${snippets}
  // snippet --${token.name}
  //   var(--${token.name}, ${token.value})${!token.value?.startsWith?.('#') ? '' : `
  // snippet ${token.value.replace(/^#/, '')}
  //   var(--${token.name}, ${token.value})`}`, ''),
    dictionary.allTokens.reduce((snippets, token) => `${snippets}
snippet ${token.name.replaceAll('-', '')}
  var(--${token.name}\${1:, ${token.value}})$2${!token.value?.startsWith?.('#') ? '' : `
snippet ${token.value.replace(/^#/, '')}
  var(--${token.name}\${1:, ${token.value}})$2`}`, '').trimStart(),
};

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
 * @type {Format}
 */
export const hexokinase = {
  name: 'editor/hexokinase',
  format: ({ dictionary }) =>
    JSON.stringify({
      regex_pattern: COLOR_TOKEN_RE.toString().replace(/^\/|\/$/, ''),
      colour_table: Object.fromEntries(
        dictionary.allTokens
          .filter(isColor)
          .flatMap(pairAliasWithValue)
          .sort())
    }, null, 2),
};
