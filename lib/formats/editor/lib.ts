import type { DesignToken } from 'style-dictionary/types';

import { isThemeColorToken } from '../../predicates.ts';
import { getLightDarkValue } from '../../transforms.ts';

/**
 * @param token
 * @returns textmate snippet format first stop containing fallback value
 */
export function getValueFallback(token: DesignToken): string {
  return `\${1:, ${isThemeColorToken(token) ? getLightDarkValue(token) : token.$value}}`;
}

