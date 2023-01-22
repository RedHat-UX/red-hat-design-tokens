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
    return {
      hex: color.toHex(),
      rgb: color.toRgb(),
      hsl: color.toHsl(),
      hsv: color.toHsv(),
      isLight: color.isLight(),
    };
  },
};

/**
 * Add HEX, RGB, HSL, HSV, and isLight (boolean) to colour types
 * @type {import('style-dictionary').Named<import('style-dictionary').Transform>}
 */
export const hslValue = {
  name: 'color/css/hsl',
  transitive: true,
  type: 'value',
  matcher: x => isColor(x) && x.path.at(-1).endsWith('hsl'),
  transformer: function({ attributes }) {
    const { h, s, l } = attributes.hsl;
    return `${h} ${s} ${l}`;
  },
};

