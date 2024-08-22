import type { Filter } from "style-dictionary/types";

/**
 * Match tokens which contain `-color-` in the css variable name
 */
export const isColor: Filter = {
  name: 'isColor',
  filter(token) {
    return Object.values(token.attributes).includes('color');
  }
};
