// @ts-check
const TokensPlugin = require('./plugins/11ty.cjs');

module.exports = function(eleventyConfig) {
  eleventyConfig.on('eleventy.before', async function() {
    const { cp, mkdir } = await import('node:fs/promises');
    const assetsDir = `${__dirname}/build/assets`;
    await mkdir(assetsDir, { recursive: true });
    await cp(`${__dirname}/css/global.css`, `${assetsDir}/rhds.css`);
    await cp(`${__dirname}/plugins/11ty/styles.css`, `${assetsDir}/styles.css`);
  });

  eleventyConfig.addPassthroughCopy('docs/assets');

  eleventyConfig.addGlobalData('importMap', async function() {
    const { Generator } = await import('@jspm/generator');
    const generator = new Generator();
    await generator.install([
      '@rhds/elements',
      '@rhds/elements/rh-footer/rh-global-footer.js',
      '@rhds/elements/rh-tooltip/rh-tooltip.js',
    ]);
    return generator.getMap();
  });

  eleventyConfig.addPlugin(TokensPlugin);

  return {
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'docs',
      output: 'build',
    },
  };
};
