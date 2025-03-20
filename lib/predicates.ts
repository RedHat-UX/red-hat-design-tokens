import type { Token } from 'style-dictionary';

export type Predicate = (token: Token) => boolean;

export const and = (p: Predicate, q: Predicate): Predicate => x => p(x) && q(x);
export const not = (p: Predicate): Predicate => x => !p(x);

export const isColor: Predicate = token =>
  token.$type === 'color';

export const isDeprecatedRGBHSL: Predicate = token =>
  !!token.path.at(-1).match(/rgb|hsl/);

export const isBreakpoint: Predicate = token =>
  token.path.includes('breakpoint');

export const isMobile: Predicate = token =>
  token.path.includes('mobile');

export const isTablet: Predicate = token =>
  token.path.includes('tablet');

export const isShadow: Predicate = token =>
  token.$type === 'shadow';

export const isCubicBezier: Predicate = token =>
  token.$type === 'cubicBezier';

export const isFontFamily: Predicate = token =>
  token.$type === 'fontFamily';

export const isFontWeight: Predicate = token =>
  token.$type === 'fontWeight';

export const isMediaQuery: Predicate = token =>
  token.$type === 'mediaQuery';

export const hasExtensions: Predicate = token =>
  !!token.$extensions;

export const isDescription = and(
  hasExtensions,
  token =>
    token.path.at(-1) === 'description',
);

export const hasDescription = and(
  hasExtensions,
  token =>
    token.$extensions['com.redhat.ux'].description,
);

export const isThemeColorToken: Predicate = token =>
  isColor(token) && Array.isArray(token.original?.$value);

export const isNotThemeColorToken = not(isThemeColorToken);

export const isLightThemeColorToken = and(
  isColor,
  token =>
    token.path.at(-1) === ('on-light'),
);

const ColorPalettes = [
  'lightest',
  'lighter',
  'light',
  'dark',
  'darker',
  'darkest',
];

export const isSurfaceColorPaletteToken: Predicate = token =>
  token.path.at(1) === 'surface'
    && ColorPalettes.includes(token.path.at(-1));

export const isDarkThemeColorToken = and(
  isColor,
  token =>
    token.path.at(-1) === ('on-dark'),
);
