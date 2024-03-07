import StyleDictionary from 'style-dictionary';
const { fileHeader } = StyleDictionary.formatHelpers;
import { isColor, isSyntax } from '../predicates.js';

/**
 * Prism Syntax CSS
 * @type {import('style-dictionary').Format}
 */
export const prismCss = {
  name: 'css/prism',
  formatter: ({ file, dictionary }) => [
    fileHeader({ file }),
    dictionary
      .allTokens
      .filter(isColor)
      .filter(isSyntax)
      .map(x => `pre[class^="lang"].token.${x.name
        .replace(/rh-color-syntax-([-\w])/, '$1')
        .replace(/-on-(light|dark)$/, '')}{color:var(--${x.name},${x.value});}`).join('\n')
  ].join('\n'),
};
