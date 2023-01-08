const TokensPlugin = require('./plugins/11ty.cjs');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(TokensPlugin);
  return {
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'docs',
      output: 'build',
    },
  };
};
