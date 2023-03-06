// @ts-check
const TokensPlugin = require('./plugins/11ty.cjs');

/** @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig */
module.exports = function(eleventyConfig) {
  eleventyConfig.on('eleventy.before', () => import('./build.js').then(m => new Promise(r => (m.build(), setTimeout(r, 50)))));
  eleventyConfig.setServerPassthroughCopyBehavior('passthrough');
  eleventyConfig.addWatchTarget('lib/**/*.js');
  eleventyConfig.addWatchTarget('tokens/**/*.{yml,yaml}');
  eleventyConfig.addWatchTarget('plugins/**/*.{cjs,js}');
  eleventyConfig.addPlugin(TokensPlugin);
  eleventyConfig.addPassthroughCopy({ 'docs/assets': 'assets' });
  eleventyConfig.addPassthroughCopy({ 'css/global.css': 'assets/rhds.css' });
  eleventyConfig.addPassthroughCopy({ 'css/prism.css': 'assets/prism.css' });
  eleventyConfig.addPassthroughCopy({ 'css/highlightjs.css': 'assets/highlightjs.css' });
  eleventyConfig.addPassthroughCopy({ 'plugins/11ty/styles.css': 'assets/11ty.css' });
  eleventyConfig.addGlobalData('importMap', async function() {
    const { Generator } = await import('@jspm/generator');
    const generator = new Generator();
    await generator.install([
      '@rhds/elements',
      // '@rhds/elements/rh-tabs/rh-tabs.js',
      '@rhds/elements/rh-footer/rh-global-footer.js',
      '@rhds/elements/rh-tooltip/rh-tooltip.js',
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
