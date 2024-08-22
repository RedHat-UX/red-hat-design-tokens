import type { Transform } from 'style-dictionary/types';

import * as Predicates from '../predicates.ts';

/**
 * Transforms which build media queries
 */
export const mediaQuery: Transform = {
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

