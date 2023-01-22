import Color from 'tinycolor2';
import { isColor } from '../predicates.js';

/**
 * Add HEX, RGB, HSL, HSV, and isLight (boolean) to colour types
 * @type {import('style-dictionary').Named<import('style-dictionary').Transform>}
 */
export const colorFormats = {
  name: 'attribute/color',
  type: 'attribute',
  matcher: isColor,
  transformer: function(token) {
    const color = Color(token.$value);
    const { h, s, l, a } = color.toHsl();
    return {
      hex: color.toHex(),
      rgb: color.toRgb(),
      hsl: { h, s: s * 100, l: l * 100, a },
      hsv: color.toHsv(),
      isLight: color.isLight(),
    };
  },
};

/**
 * Use HSL values
 * @type {import('style-dictionary').Named<import('style-dictionary').Transform>}
 */
export const hslValue = {
  name: 'color/css/hsl',
  transitive: true,
  type: 'value',
  matcher: x => isColor(x) && x.path.at(-1).endsWith('hsl'),
  transformer: function(token) {
    const { h, s, l } = token.attributes.hsl;
    token.$value = `${h} ${s}% ${l}%`;
    return token.$value;
  },
};

/**
 * Use rgb values
 * @type {import('style-dictionary').Named<import('style-dictionary').Transform>}
 */
export const rgbValue = {
  name: 'color/css/rgb',
  transitive: true,
  type: 'value',
  matcher: x => isColor(x) && x.path.at(-1).endsWith('rgb'),
  transformer: function(token) {
    const { r, g, b } = token.attributes.rgb;
    token.$value = `${r} ${g} ${b}`;
    return token.$value;
  },
};

