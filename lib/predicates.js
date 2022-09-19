import { getType } from './sources.js';

/** @typedef {(token: import('style-dictionary').DesignToken) => boolean} Predicate */

/** @type{(p: Predicate, q: Predicate) => Predicate} */
const and = (p, q) => x => p(x) && q(x);

/** @type {Predicate} */
export const isColor = token =>
  getType(token) === 'color';

/** @type {Predicate} */
export const isBreakpoint = token =>
  token.path.includes('breakpoint');

/** @type {Predicate} */
export const isMobile = token =>
  token.path.includes('mobile');

/** @type {Predicate} */
export const isTablet = token =>
  token.path.includes('tablet');

/** @type {Predicate} */
export const isShadow = token =>
  getType(token) === 'shadow';

/** @type {Predicate} */
export const isCubicBezier = token =>
  getType(token) === 'cubicBezier';

/** @type {Predicate} */
export const isFontFamily = token =>
  getType(token) === 'fontFamily';

/** @type {Predicate} */
export const isFontWeight = token =>
  getType(token) === 'fontWeight';

/** @type {Predicate} */
export const isMediaQuery = token =>
  getType(token) === 'mediaQuery';

/** @type {Predicate} */
export const hasExtensions = token =>
  !!token.$extensions;

/** @type {Predicate} */
export const isDescription = and(hasExtensions, token => token.path.at(-1) === 'description');
export const hasDescription = and(hasExtensions, token => token.$extensions['com.redhat.ux'].description);
