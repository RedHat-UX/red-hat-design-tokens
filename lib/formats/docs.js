import { createRequire } from 'node:module';

/**
 * Generates a single-file web page to demonstrate token values
 * @type {import('style-dictionary').Format}
 */
export const docsPage = {
  name: 'html/docs',
  format() {
    const require = createRequire(import.meta.url);
    const Eleventy = require('@11ty/eleventy');
    const eleventy = new Eleventy('.', 'build', {
      config(eleventyConfig) {
        eleventyConfig.addPlugin(require('../../plugins/11ty.cjs'));
      }
    });
    eleventy.write();
  }
};
