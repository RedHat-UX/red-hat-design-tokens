/**
 * Add px values as numbers at the `px` attribute
 * @type {import('style-dictionary').Named<import('style-dictionary').Transform>}
 */
export const pxNumeric = {
  name: 'attribute/px',
  type: 'attribute',
  matcher: token => token.value?.endsWith?.('px'),
  transformer: function(token) {
    const val = parseFloat(token.value);
    token.attributes.px = val;
    return token.value;
  }
};
