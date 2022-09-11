import StyleDictionary from 'style-dictionary';

/** @typedef {import('style-dictionary').Named<import('style-dictionary').TransformGroup>} TransformGroup */

const DTCG_BASIS = [
  'dtcg/value',
  'dtcg/description',
  'dtcg/type/nested',
];

const DTCG_CSS = [
  ...DTCG_BASIS,
  'dtcg/cubic-bezier/css',
  'dtcg/font-family/css',
  'dtcg/font-weight/css',
  'dtcg/shadow/css',
];

/**
 * Transforms to apply to s/css outputs
 * @type {TransformGroup}
 */
export const css = {
  name: 'css',
  transforms: [
    ...DTCG_CSS,
    'media-query/css',
    'attribute/cti',
    'attribute/color',
    'attribute/px',
    'name/cti/kebab',
    'time/seconds',
    'content/icon',
    'color/css',
  ],
};

/**
 * Transforms to apply to js outputs
 * @type {TransformGroup}
 */
export const js = {
  name: 'js',
  transforms: [
    ...DTCG_CSS,
    ...StyleDictionary.transformGroup.js
  ],
};

/**
 * Transforms to apply to Sketch palette output
 * @type {TransformGroup}
 */
export const sketch = {
  name: 'sketch',
  transforms: [
    ...DTCG_BASIS,
    'attribute/cti',
    'attribute/color',
    'attribute/px',
    'name/cti/kebab',
    'color/sketch',
  ],
};
