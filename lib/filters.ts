import type { Filter } from 'style-dictionary/types';

import * as Predicates from './predicates.ts';

/**
 * Match tokens which contain `-color-` in the css variable name
 */
export const isColor: Filter = {
  name: 'isColor',
  filter(token) {
    return Object.values(token.attributes).includes('color');
  },
};

export const isThemeColorToken: Filter = {
  name: 'isThemeColorToken',
  filter: Predicates.isThemeColorToken,
};

export const isNotThemeColorToken: Filter = {
  name: 'isNotThemeColorToken',
  filter: Predicates.isNotThemeColorToken,
};

export const isLightThemeColorToken: Filter = {
  name: 'isLightThemeColorToken',
  filter: Predicates.isLightThemeColorToken,
};

export const isDarkThemeColorToken: Filter = {
  name: 'isDarkThemeColorToken',
  filter: Predicates.isDarkThemeColorToken,
};
