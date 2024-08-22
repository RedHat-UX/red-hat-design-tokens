import type { Transform } from "style-dictionary/types";

/**
 * Add px values as numbers at the `px` attribute
 */
export const pxNumeric: Transform = {
  name: 'attribute/px',
  type: 'attribute',
  filter: token => token.$value?.endsWith?.('px'),
  transform(token) {
    const px = parseFloat(token.$value);
    return { ...token.attributes, px };
  }
};
