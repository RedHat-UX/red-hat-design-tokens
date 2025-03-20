import type { Format } from 'style-dictionary/types';
import { getValueFallback } from './lib.ts';
/**
 * Exports textmate-style snippets for editor support
 * @example ```snippets
 *          snippet --rh-color-black
 *            var(--rh-color-black, #000)
 *          ```
 */
export const textmateSnippets: Format = {
  name: 'editor/snippets/textmate',
  format: ({ dictionary }) =>
    dictionary.allTokens.reduce((snippets, token) => `${snippets}${token.$description ? `
# ${token.$description}` : ''}
snippet ${token.name.replaceAll('-', '')}
  var(--${token.name}${getValueFallback(token)})$2${!token.$value?.startsWith?.('#') ? '' : `
snippet ${token.$value.replace(/^#/, '')}
  var(--${token.name}\${1:, ${token.$value}})$2`}`, '').trimStart(),
};
