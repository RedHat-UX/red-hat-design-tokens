/**
 * Add px values as numbers at the `px` attribute
 * @type {import('style-dictionary').Named<import('style-dictionary').Transform>}
 */
export const pxNumeric = {
  name: 'attribute/px',
  type: 'attribute',
  filter: token => token.$value?.endsWith?.('px'),
  transform(token) {
    const px = parseFloat(token.$value);
    return { ...token.attributes, px };
  }
};
