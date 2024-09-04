import type UserConfig from '@11ty/eleventy';

import { Generator } from '@jspm/generator';
import { PreviewPagePlugin } from './lib/11ty/preview-page-plugin.ts';

export default function(eleventyConfig: UserConfig) {
  eleventyConfig.addPlugin(PreviewPagePlugin);
  eleventyConfig.setServerPassthroughCopyBehavior('passthrough');
  eleventyConfig.addWatchTarget('lib/**/*.{js,ts}');
  eleventyConfig.addWatchTarget('tokens/**/*.{yml,yaml}');
  eleventyConfig.addWatchTarget('plugins/**/*.{cjs,js}');
  eleventyConfig.addPassthroughCopy({
    'docs/assets': 'assets',
    'css/': 'assets/packages/@rhds/tokens/css/',
    'node_modules/@rhds/icons': 'assets/packages/@rhds/icons',
    'node_modules/@rhds/elements': 'assets/packages/@rhds/elements',
  });
  eleventyConfig.addGlobalData('importMap', async function() {
    const generator = new Generator();
    await generator.install([
      '@rhds/elements',
      '@rhds/elements/rh-footer/rh-footer-universal.js',
      '@rhds/elements/rh-tooltip/rh-tooltip.js',
      '@rhds/elements/rh-card/rh-card.js',
      '@rhds/elements/rh-switch/rh-switch.js',
      '@rhds/elements/rh-surface/rh-surface.js',
    ]);
    return generator.getMap();
  });
  return {
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'docs',
      output: 'build',
    },
  };
};
