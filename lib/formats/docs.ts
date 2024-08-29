import type { Format } from 'style-dictionary/types';
import type { UserConfig } from '@11ty/eleventy';

import { createRequire } from 'node:module';

/**
 * Generates a single-file web page to demonstrate token values
 */
export const docsPage: Format = {
  name: 'html/docs',
  format() {
    const require = createRequire(import.meta.url);
    const Eleventy = require('@11ty/eleventy');
    const eleventy = new Eleventy('.', 'build', {
      config(eleventyConfig: UserConfig) {
        eleventyConfig.addPlugin(require('../../plugins/11ty.cjs'));
      },
    });
    eleventy.write();
  },
};
