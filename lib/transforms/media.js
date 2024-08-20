import * as Predicates from '../predicates.js';

/**
 * Transforms which build media queries
 */

/**
 * @type {import('style-dictionary').Named<import('style-dictionary').Transform>}
 */
export const mediaQuery = {
  name: 'media-query/css',
  type: 'value',
  transitive: true,
  filter: Predicates.isMediaQuery,
  transform(token) {
    const minWidth = token.$value['min-width'];
    const maxWidth = token.$value['max-width'];
    const string = [
      minWidth && `(min-width: ${minWidth})`,
      maxWidth && `(max-width: ${maxWidth})`
    ].filter(Boolean).join(' and ');
    token.$value = string;
    return string;
  },
};

