import StyleDictionary from 'style-dictionary';
const { fileHeader } = StyleDictionary.formatHelpers;
import { isColor, isOnDark, isOnLight, isSyntax } from '../predicates.js';


const highlighjsTokens = new Map(Object.entries({
  'attr-name': 'attr',
  'attr-value': 'attr',
  // 'boolean':
  'class-name': 'class',
  // 'comment':
  // 'constant':
  // 'function':
  // 'keyword':
  // 'number':
  // 'operator':
  // 'property':
  // 'punctuation':
  // 'regex':
  // 'string':
  // 'symbol':
  // 'tag':
  // 'variable':
}));

/**
 * Prism Syntax CSS
 * @type {import('style-dictionary').Format}
 */
export const highlightjsCss = {
  name: 'css/highlightjs',
  formatter: ({ file, dictionary }) => {
    const syntaxColors =
      dictionary
        .allTokens
        .filter(isSyntax)
        .filter(isColor);
    const onLight = syntaxColors.filter(isOnLight);
    const onDark = syntaxColors.filter(isOnDark);
    return [
      fileHeader({ file }),
      ...onLight
        .map(x => `.hljs-${x.name
          .replace('built-in', 'built_in')
          .replace(/rh-color-syntax-([-\w]+)/, (_, match) => highlighjsTokens.get(match) ?? match)
          .replace(/-on-light$/, '')}{color:var(--${x.name},${x.value});}`),
      ...onDark
        .map(x => `.dark .hljs-${x.name
          .replace('built-in', 'built_in')
          .replace(/rh-color-syntax-([-\w]+)/, (_, match) => highlighjsTokens.get(match) ?? match)
          .replace(/-on-dark$/, '')}{color:var(--${x.name},${x.value});}`),
    ].join('\n');
  },
};
