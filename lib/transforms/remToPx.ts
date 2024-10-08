import type { Transform } from 'style-dictionary/types';

/**
 * Add px values for rem-based tokens, assuming default 16px base px font size
 */
export const remToPx: Transform = {
  name: 'remToPx/css',
  type: 'attribute',
  transitive: true,
  filter: token => token.$value?.endsWith?.('rem'),
  transform(token, options) {
    const val = parseFloat(token.$value);
    const baseFont = options?.basePxFontSize || 16;
    if (Number.isNaN(val)) {
      throw new Error(`Invalid Number: '${token.name}: ${token.$value}' is not a valid number, cannot transform to 'px' \n`);
    }
    const px = `${(val * baseFont).toFixed(0)}px`;
    return { ...token.attributes, px };
  },
};
