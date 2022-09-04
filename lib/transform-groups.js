import StyleDictionary from 'style-dictionary';

/**
 * Transforms to apply to s/css outputs
 * @type {import('style-dictionary').Named<import('style-dictionary').TransformGroup>}
 */
export const css = {
  name: 'css',
  transforms: [
    'dtcg/cubic-bezier/css',
    'dtcg/font-family/css',
    'dtcg/font-weight/css',
    'dtcg/shadow/css',
    'dtcg/type/color',
    'attribute/cti',
    'attribute/color',
    'attribute/px',
    'name/cti/kebab',
    'time/seconds',
    'content/icon',
    // 'size/rem',
    // 'remToPx/css',
    'color/css',
  ],
};

/**
 * Transforms to apply to js outputs
 * @type {import('style-dictionary').Named<import('style-dictionary').TransformGroup>}
 */
export const js = {
  name: 'js',
  transforms: [
    'dtcg/cubic-bezier/css',
    'dtcg/font-family/css',
    'dtcg/font-weight/css',
    'dtcg/shadow/css',
    'dtcg/type/color',
    ...StyleDictionary.transformGroup.js
  ],
};

/**
 * Transforms to apply to Sketch palette output
 * @type {import('style-dictionary').Named<import('style-dictionary').TransformGroup>}
 */
export const sketch = {
  name: 'sketch',
  transforms: [
    'dtcg/type/color',
    'attribute/cti',
    'attribute/color',
    'attribute/px',
    'name/cti/kebab',
    'color/sketch',
  ],
};
