import * as Predicates from '../predicates.js';
import { getType } from '../sources.js';

/**
 * Transforms which aim to comply with Design Tokens Community Group draft report
 * @see https://design-tokens.github.io/community-group/format/
 */

/** @typedef {import('style-dictionary').Named<import('style-dictionary').Transform>} Transform */

/**
 * Applies `$value` per Design Tokens Format Module
 * @type {Transform}
 * @see https://design-tokens.github.io/community-group/format/#value
 */
export const value = {
  name: 'dtcg/value',
  type: 'value',
  transitive: true,
  transformer: token => {
    return token.$value;
  },
};

/**
 * Applies `$description` per Design Tokens Format Module
 * @type {Transform}
 * @see https://design-tokens.github.io/community-group/format/#description
 */
export const description = {
  name: 'dtcg/description',
  type: 'attribute',
  transitive: true,
  transformer: token => {
    token.comment ??= token.$description;
    return token.attributes;
  },
};

/**
 * Inherits `$type` per Design Tokens Format Module
 * @type {Transform}
 * @see https://design-tokens.github.io/community-group/format/#type-0
 */
export const typeNested = {
  name: 'dtcg/type/nested',
  type: 'attribute',
  transitive: true,
  transformer: token => {
    token.$type ??= getType(token);
    if (token.$type == null) {
      delete token.$type;
    }
    return token.attributes;
  },
};

/**
 * Transform a record or box-shadow properties to a css box-shadow property value
 * @type {Transform}
 * @see https://design-tokens.github.io/community-group/format/#shadow
 */
export const shadow = {
  name: 'dtcg/shadow/css',
  type: 'value',
  transitive: true,
  matcher: Predicates.isShadow,
  transformer: token => {
    const { offsetX, offsetY, blur, spread, color } = token.$value;
    const string = `${offsetX} ${offsetY} ${blur} ${spread} ${color}`;
    token.$value = string;
    return string;
  },
};

/**
 * Transform an array of cubic bezier timing values to a css cubic-bezier() call
 * @type {Transform}
 * @see https://design-tokens.github.io/community-group/format/#cubic-bezier
 */
export const cubicBezier = {
  name: 'dtcg/cubic-bezier/css',
  type: 'value',
  matcher: Predicates.isCubicBezier,
  transformer: token => {
    const string = `cubic-bezier(${token.$value.join(', ')})`;
    token.$value = string;
    return string;
  },
};

/**
 * Transform an array of font family specifiers to a comma separated list
 * @type {Transform}
 * @see https://design-tokens.github.io/community-group/format/#font-family
 */
export const fontFamily = {
  name: 'dtcg/font-family/css',
  type: 'value',
  matcher: Predicates.isFontFamily,
  transformer: token => {
    const string = `${token.$value.map(x => x.match(/\s/) ? `"${x}"` : x).join(', ')}`;
    token.$value = string;
    return string;
  },
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
 * @type {Transform}
 * @see https://design-tokens.github.io/community-group/format/#font-weight
 */
export const fontWeight = {
  name: 'dtcg/font-weight/css',
  transitive: true,
  type: 'attribute',
  matcher: Predicates.isFontWeight,
  transformer: function(token) {
    return { ...token.attributes, aliases: WGHT_ALIASES[token.$value] };
  }
};

