export const isColor = token => token.$type === 'color' || token.path.includes('color');
export const isBreakpoint = token => token.path.includes('breakpoint');
export const isMobile = token => token.path.includes('mobile');
export const isTablet = token => token.path.includes('tablet');
export const isShadow = token => token.$type === 'shadow';
export const isCubicBezier = token => token.$type === 'cubicBezier';
export const isFontFamily = token => token.$type === 'fontFamily';
export const isFontWeight = token => token.$type === 'fontWeight';
