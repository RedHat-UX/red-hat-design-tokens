import type { UserConfig } from '@11ty/eleventy';

import { PreviewPagePlugin } from './lib/11ty/preview-page-plugin.ts';

export default function(eleventyConfig: UserConfig) {
  eleventyConfig.addPlugin(PreviewPagePlugin);
  eleventyConfig.setServerPassthroughCopyBehavior('passthrough');
  eleventyConfig.addWatchTarget('lib/**/*.{js,ts}');
  eleventyConfig.addWatchTarget('tokens/**/*.{yml,yaml}');
  eleventyConfig.addWatchTarget('plugins/**/*.{cjs,js}');
  eleventyConfig.addPassthroughCopy({
    'docs/assets': 'assets',
    'css/global.css': 'assets/rhds.css',
    'css/prism.css': 'assets/prism.css',
    'css/color-context-*.css': 'assets/',
    'plugins/11ty/styles.css': 'assets/11ty.css',
    'node_modules/@rhds/icons': 'assets/packages/@rhds/icons',
    'node_modules/@rhds/elements': 'assets/packages/@rhds/elements',
  });
  return {
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'docs',
      output: 'build',
    },
  };
};
