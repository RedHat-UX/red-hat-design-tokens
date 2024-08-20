/** @typedef {import('style-dictionary').Named<import('style-dictionary').TransformGroup>} TransformGroup */

/**
 * Transforms to apply to s/css outputs
 * @type {TransformGroup}
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
  ],
};

/**
 * Transforms to apply to js outputs
 * @type {TransformGroup}
 */
export const js = {
  name: 'js',
  transforms: css.transforms,
};

/**
 * Transforms to apply to Sketch palette output
 * @type {TransformGroup}
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
