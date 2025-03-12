import type { DesignToken, Format } from 'style-dictionary/types';
import type { Dictionary } from 'style-dictionary';
import { fileHeader, getReferences } from 'style-dictionary/utils';
import { isSurfaceColorPaletteToken, isThemeColorToken } from '../predicates.ts';
import { constructStyleSheet } from './lit.ts';

function dereferenceToken(token: DesignToken, dictionary: Dictionary) {
  const references = getReferences(token, dictionary.unfilteredTokens);
  if (references.length > 1) {
    // eslint-disable-next-line no-console
    console.warn(`WARNING: ${token.name} has multiple references: ${references.map(r => r.name)}`);
  }
  const [first] = references;
  return first;
}

function getThemeTokensForConsumer(dictionary: Dictionary) {
  return dictionary.allTokens.filter(isThemeColorToken).map(token => {
    switch (token.name) {
      case 'rh-color-surface': return /* css */`\
  --rh-color-surface:
    light-dark(
      var(--rh-color-surface-lightest, ${dictionary.allTokens.find(x => x.name === 'rh-color-surface-lightest').$value}),
      var(--rh-color-surface-darkest, ${dictionary.allTokens.find(x => x.name === 'rh-color-surface-darkest').$value})
    );`;
    }

    const [light, dark] = token.original.$value.map(x => dereferenceToken(x, dictionary));

    return /* css */`\
  --${token.name}:
    light-dark(
      var(--${light.name}, ${light.$value}),
      var(--${dark.name}, ${dark.$value})
    );`;
  }).join('\n');
}

function consumer(dictionary: Dictionary) {
  return /* css*/`
:root, :host {\n${getThemeTokensForConsumer(dictionary)}\n}
`;
}

function provider({ allTokens }: Dictionary) {
  const surfaceTokens = allTokens.filter(isSurfaceColorPaletteToken);
  return /* css*/`
:host { color-scheme: inherit; }
:host([color-palette^="dark"]) { color-scheme: only dark; }
:host([color-palette^="light"]) { color-scheme: only light; }
${surfaceTokens.map(({ name, path, $value }) => /* css */`
:host([color-palette="${path.at(-1)}"]) { --rh-color-surface: var(--${name}, ${$value}); }`.trimStart()).join('\n')}`;
}

const formatter = (fn: (d: Dictionary) => string) =>
  async ({ file, dictionary }) =>
    `${await fileHeader({ file })}${fn(dictionary)}`;

export const cssRhdsColorScheme: Format = {
  name: 'css/rhds/color-scheme',
  format: formatter(consumer),
};

export const jsRhdsColorScheme: Format = {
  name: 'js/rhds/color-scheme',
  format: formatter(x => constructStyleSheet(consumer(x))),
};

export const cssRhdsColorPalette: Format = {
  name: 'css/rhds/color-palette',
  format: formatter(provider),
};

export const jsRhdsColorPalette: Format = {
  name: 'js/rhds/color-palette',
  format: formatter(x => constructStyleSheet(provider(x))),
};
