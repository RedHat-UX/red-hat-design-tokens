import type { Format } from 'style-dictionary/types';
import type { Dictionary } from 'style-dictionary';
import { fileHeader, getReferences } from 'style-dictionary/utils';
import { isSurfaceColorPaletteToken, isThemeColorToken } from '../predicates.ts';
import { constructStyleSheet } from './lit.ts';

function getThemeTokensForConsumer(dictionary: Dictionary, surface: 'light' | 'dark') {
  const index = ['light', 'dark'].indexOf(surface);

  return dictionary.allTokens.filter(isThemeColorToken).map(token => {
    switch (token.name) {
      case 'rh-color-surface': return '';
    }

    const variant = token.original.$value.at(index);
    const references = getReferences(variant, dictionary.unfilteredTokens);
    if (references.length > 1) {
      console.log(`${token.name} has multiple references: ${references.map(r => r.name)}`);
    }
    const [first] = references;
    return `  --${token.name}: var(--${first.name}, ${first.$value});\n`;
  }).join('');
}

function consumer(dictionary: Dictionary) {
  return /* css*/`
.on.light {\n${getThemeTokensForConsumer(dictionary, 'light')}\n}

.on.dark {\n${getThemeTokensForConsumer(dictionary, 'dark')}\n}
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
