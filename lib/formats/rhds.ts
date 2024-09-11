import type { Format } from 'style-dictionary/types';
import type { Dictionary } from 'style-dictionary';
import { fileHeader, getReferences } from 'style-dictionary/utils';
import { isSurfaceColorPaletteToken, isThemeColorToken } from '../predicates.ts';

function getThemeTokens(index: 0 | 1) {
  return function(dictionary: Dictionary) {
    return dictionary.allTokens.filter(isThemeColorToken).map(token => {
      const variant = token.original.$value.at(index);
      const references = getReferences(variant, dictionary.unfilteredTokens);
      if (references.length > 1) {
        console.log(`${token.name} has multiple references: ${references.map(r => r.name)}`);
      }
      const [first] = references;
      return `  --${token.name}: var(--${first.name}, ${first.$value});`;
    }).join('\n');
  };
}

const getLightTokens = getThemeTokens(0);
const getDarkTokens = getThemeTokens(1);

/**
 */
export const rhdsColorContextConsumer: Format = {
  name: 'css/rhds/color-context-consumer',
  format: async ({ file, dictionary }) => `${await fileHeader({ file })}
:is(.on.light, .on:not(.dark)) {\n${getLightTokens(dictionary)}\n}

.on.dark {\n${getDarkTokens(dictionary)}\n}
`,
};


/**
 */
export const rhdsColorContextProvider: Format = {
  name: 'css/rhds/color-context-provider',
  format: async ({ file, dictionary }) =>
    `${await fileHeader({ file })}
:host([color-palette^="dark"]) { --context: dark; }
:host([color-palette^="light"]) { --context: light; }

${dictionary.allTokens.filter(isSurfaceColorPaletteToken)
      .map(token => `
:host([color-palette="${token.path.at(-1)}"]) {
  --rh-color-surface: var(--${token.name}, ${token.$value});
}
`.trimStart()).join('\n')}`,
};
