export const isColor = token => token.$type === 'color' || token.path.includes('color');
export const isShadow = token => token.$type === 'shadow';
export const isCubicBezier = token => token.$type === 'cubicBezier';
export const isFontFamily = token => token.$type === 'fontFamily';
export const isFontWeight = token => token.$type === 'fontWeight';
