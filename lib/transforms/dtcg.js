import * as Predicates from '../predicates.js';

/**
 * Transforms which aim to comply with Design Tokens Community Group draft report
 * @see https://design-tokens.github.io/community-group/format/
 */

/**
 * Design Tokens Format Module color
 * @type {import('style-dictionary').Named<import('style-dictionary').Transform>}
 * @see https://design-tokens.github.io/community-group/format/#color
 */
export const typeColor = {
  name: 'dtcg/type/color',
  type: 'attribute',
  transitive: true,
  matcher: Predicates.isColor,
  transformer: token => {
    token.$type ??= 'color';
    return token.attributes;
  },
};

/**
 * Transform a record or box-shadow properties to a css box-shadow property value
 * @type {import('style-dictionary').Named<import('style-dictionary').Transform>}
 * @see https://design-tokens.github.io/community-group/format/#shadow
 */
export const shadow = {
  name: 'dtcg/shadow/css',
  type: 'value',
  transitive: true,
  matcher: Predicates.isShadow,
  transformer: token =>
    `${token.value.offsetX} ${token.value.offsetY} ${token.value.blur} ${token.value.spread} ${token.value.color}`,
};

/**
 * Transform an array of cubic bezier timing values to a css cubic-bezier() call
 * @type {import('style-dictionary').Named<import('style-dictionary').Transform>}
 * @see https://design-tokens.github.io/community-group/format/#cubic-bezier
 */
export const cubicBezier = {
  name: 'dtcg/cubic-bezier/css',
  type: 'value',
  matcher: Predicates.isCubicBezier,
  transformer: ({ value }) =>
    `cubic-bezier(${value.join(', ')})`,
};

/**
 * Transform an array of font family specifiers to a comma separated list
 * @type {import('style-dictionary').Named<import('style-dictionary').Transform>}
 * @see https://design-tokens.github.io/community-group/format/#font-family
 */
export const fontFamily = {
  name: 'dtcg/font-family/css',
  type: 'value',
  matcher: Predicates.isFontFamily,
  transformer: /** @param {{value: string[]}} value */({ value }) =>
    `${value.map(x => x.match(/\s/) ? `"${x}"` : x).join(', ')}`,
};

/** OpenFont weight string aliases */
const WGHT_ALIASES = {
  100: ['thin', 'hairline'],
  200: ['extra-light', 'ultra-light'],
  300: ['light'],
  400: ['regular', 'normal', 'book'],
  500: ['medium',],
  600: ['semi-bold', 'demi-bold'],
  700: ['bold'],
  800: ['extra-bold', 'ultra-bold'],
  900: ['black', 'heavy'],
  950: ['extra-black', 'ultra-black']
};

/**
 * Add font weight string aliases to font-weight types
 * @type {import('style-dictionary').Named<import('style-dictionary').Transform>}
 * @see https://design-tokens.github.io/community-group/format/#font-weight
 */
export const fontWeight = {
  name: 'dtcg/font-weight/css',
  transitive: true,
  type: 'value',
  matcher: Predicates.isFontWeight,
  transformer: function(token) {
    token.attributes.aliases = WGHT_ALIASES[token.value];
    return token.value;
  }
};

