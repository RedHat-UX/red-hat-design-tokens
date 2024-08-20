/**
 * Match tokens which contain `-color-` in the css variable name
 * @type {import('style-dictionary').Named<import('style-dictionary').Filter>}
 */
export const isColor = {
  name: 'isColor',
  filter(token) {
    return Object.values(token.attributes).includes('color');
  }
};
