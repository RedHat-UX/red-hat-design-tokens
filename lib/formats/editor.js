import { isColor } from '../predicates.js';

/**
 * Exports VSCode style snippets for editor support
 * @type {import('style-dictionary').Format}
 */
export const vscodeSnippets = {
  name: 'snippets/vscode',
  formatter: ({ dictionary }) =>
    JSON.stringify(Object.fromEntries(
      dictionary.allTokens.map(token => {
        return [
          token.title ?? token.name,
          {
            scope: 'css,scss',
            prefix: [
              `--${token.name}`,
              token.value?.startsWith?.('#') ? token.value.replace(/^#/, '') : null
            ].filter(Boolean),
            body: [`var(--${token.name}, ${token.value})`],
            description: token.comment,
          },
        ];
      })), null, 2),
};

const pairAliasWithValue = token => {
  if (typeof token.value === 'string') {
    const name = token.original?.value?.startsWith('{') ? token.original.value.replace(/\._}$/, '}') : `{${token.path.reduce((a, b) => `${a}.${b}`, '')}}`.replace(/^\{\./, '{');
    return [[name, token.value]];
  } else if (token.value) {
    return Object.fromEntries(Object.entries(token.value).map(pairAliasWithValue));
  } else {
    return [];
  }
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
 * @type {import('style-dictionary').Format}
 */
export const hexokinase = {
  name: 'editor/hexokinase',
  formatter: ({ dictionary }) =>
    JSON.stringify({
      regex_pattern: COLOR_TOKEN_RE.toString().replace(/^\/|\/$/, ''),
      colour_table: Object.fromEntries(
        dictionary.allTokens
          .filter(isColor)
          .flatMap(pairAliasWithValue)
          .sort())
    }, null, 2),
};
