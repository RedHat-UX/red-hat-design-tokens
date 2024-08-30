/**
 * Transforms to apply to s/css outputs
 */
export const css = {
  name: 'css',
  transforms: [
    'media-query/css',
    'attribute/cti',
    'attribute/color',
    'attribute/px',
    'name/kebab',
    'time/seconds',
    'html/icon',
    'color/css',
    'color/css/hsl',
    'color/css/rgb',
    'color/css/themetokens',
  ],
};

/**
 * Transforms to apply to js outputs
 */
export const js = {
  name: 'js',
  transforms: css.transforms,
};

/**
 * Transforms to apply to Sketch palette output
 */
export const sketch = {
  name: 'sketch',
  transforms: [
    'attribute/cti',
    'attribute/color',
    'attribute/px',
    'name/kebab',
    'color/sketch',
  ],
};
