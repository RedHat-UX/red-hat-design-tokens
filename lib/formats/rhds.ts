import type { Format } from 'style-dictionary/types';
import type { Dictionary } from 'style-dictionary';
import { fileHeader, getReferences } from 'style-dictionary/utils';
import { isSurfaceColorPaletteToken, isThemeColorToken } from '../predicates.ts';
import { constructStyleSheet } from './lit.ts';

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

function consumer(dictionary: Dictionary) {
  return /* css*/`
.on.light {\n${getLightTokens(dictionary)}\n}

.on.dark {\n${getDarkTokens(dictionary)}\n}
`;
}

function provider({ allTokens }: Dictionary) {
  return /* css*/`
:host([color-palette^="dark"]) { --context: dark; }
:host([color-palette^="light"]) { --context: light; }

${allTokens.filter(isSurfaceColorPaletteToken).map(({ name, path, $value }) => /* css */`
:host([color-palette="${path.at(-1)}"]) {
  --rh-color-surface: var(--${name}, ${$value});
}`.trimStart()).join('\n')}`;
}

const formatter = (fn: (d: Dictionary) => string) =>
  async ({ file, dictionary }) =>
    `${await fileHeader({ file })}${fn(dictionary)}`;

export const cssRhdsColorContextConsumer: Format = {
  name: 'css/rhds/color-context-consumer',
  format: formatter(consumer),
};

export const cssRhdsColorContextProvider: Format = {
  name: 'css/rhds/color-context-provider',
  format: formatter(provider),
};

export const jsRhdsColorContextConsumer: Format = {
  name: 'js/rhds/color-context-consumer',
  format: formatter(x => constructStyleSheet(consumer(x))),
};

export const jsRhdsColorContextProvider: Format = {
  name: 'js/rhds/color-context-provider',
  format: formatter(x => constructStyleSheet(provider(x))),
};
