import type { Transform } from 'style-dictionary/types';

import Color from 'tinycolor2';
import { isColor, isThemeColorToken } from '../predicates.ts';

/**
 * Add HEX, RGB, HSL, HSV, and isLight (boolean) to colour types
 */
export const colorFormats: Transform = {
  name: 'attribute/color',
  type: 'attribute',
  filter: isColor,
  transform(token) {
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
 */
export const hslValue: Transform = {
  name: 'color/css/hsl',
  transitive: true,
  type: 'value',
  filter: x => isColor(x) && x.path.at(-1).endsWith('hsl'),
  transform(token) {
    const { h, s, l } = token.attributes.hsl as { h: string; s: string; l: string };
    token.$value = `${h} ${s}% ${l}%`;
    return token.$value;
  },
};

/**
 * Use rgb values
 */
export const rgbValue: Transform = {
  name: 'color/css/rgb',
  transitive: true,
  type: 'value',
  filter: x => isColor(x) && x.path.at(-1).endsWith('rgb'),
  transform(token) {
    const { r, g, b } = token.attributes.rgb as { r: string; g: string; b: string };
    token.$value = `${r} ${g} ${b}`;
    return token.$value;
  },
};

/**
 * Theme tokens
 */
export const themeTokens: Transform = {
  name: 'color/css/themetokens',
  type: 'value',
  transitive: true,
  filter: isThemeColorToken,
  transform() {
    return '';
  },
};

