import type { Format } from 'style-dictionary/types';
import { isThemeColorToken } from '../../predicates.ts';

/**
 * Exports VSCode-style snippets for editor support
 */
export const vscodeSnippets: Format = {
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
              token.$value?.startsWith?.('#') ? token.$value.replace(/^#/, '') : null,
            ].filter(Boolean),
            body: [`var(--${token.name}${isThemeColorToken(token) ? '' : `\${1:, ${token.$value}}`})$2`],
            description: token.$description,
          },
        ];
      })), null, 2),
};
