import type { Token } from 'style-dictionary';
import { getType } from './sources.ts';

export type Predicate = (token: Token) => boolean;

const and = (p: Predicate, q: Predicate): Predicate => x => p(x) && q(x);

export const isColor: Predicate = token =>
  getType(token) === 'color';

export const isBreakpoint: Predicate = token =>
  token.path.includes('breakpoint');

export const isMobile: Predicate = token =>
  token.path.includes('mobile');

export const isTablet: Predicate = token =>
  token.path.includes('tablet');

export const isShadow: Predicate = token =>
  getType(token) === 'shadow';

export const isCubicBezier: Predicate = token =>
  getType(token) === 'cubicBezier';

export const isFontFamily: Predicate = token =>
  getType(token) === 'fontFamily';

export const isFontWeight: Predicate = token =>
  getType(token) === 'fontWeight';

export const isMediaQuery: Predicate = token =>
  getType(token) === 'mediaQuery';

export const hasExtensions: Predicate = token =>
  !!token.$extensions;

export const isDescription = and(hasExtensions, token => token.path.at(-1) === 'description');
export const hasDescription = and(hasExtensions, token => token.$extensions['com.redhat.ux'].description);
