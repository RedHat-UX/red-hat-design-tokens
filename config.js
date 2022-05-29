const YAML = require('yaml');
const StyleDictionary = require('style-dictionary');
const nunjucks = require('nunjucks');
const path = require('path');

const env = nunjucks.configure(path.join(__dirname, 'docs'));

env.addFilter('log', function(x) { console.log(x); });

StyleDictionary.registerFormat({
  name: 'html/docs',
  formatter({ dictionary, platform, options }) {
    return env.render('index.html', {
      dictionary,
      platform,
      colors: dictionary.allTokens.filter(x => x.attributes?.category === 'color').reduce((acc, color) => ({
        ...acc,
        [color.attributes.type]: [
          ...acc[color.attributes.type] ?? [],
          color,
          ...Object.entries(color).flatMap(([key, value]) =>
            typeof value !== 'object' || key.match(/original|attributes|path/)? [] : ({
              ...value,
              name: value.name ?? color.path.reduce((a, b)=> `${a}-${b}`, 'rh') + '-' + key,
            }))
        ],
      }), {}),
    })
  }
});

StyleDictionary.registerTransform({
  type: 'value',
  name: 'box-shadow',
  matcher: token => token.path.includes('box-shadow'),
  transformer: ({ value: { offsetX, offsetY, blur, spread, color }}) => `${offsetX} ${offsetY} ${blur} ${spread} ${color}`
})

StyleDictionary.registerTransformGroup({
  name: 'css',
  transforms: [
    'box-shadow',
    'attribute/cti',
    'name/cti/kebab',
    'time/seconds',
    'content/icon',
    'size/rem',
    'color/css',
  ]
})

StyleDictionary.registerTransformGroup({
  name: 'scss',
  transforms: [
    'box-shadow',
    'attribute/cti',
    'name/cti/kebab',
    'time/seconds',
    'content/icon',
    'size/rem',
    'color/css',
  ]
})

module.exports = {
  source: [
    'tokens/**/*.{yaml,yml}',
  ],
  parsers: [{
    pattern: /\.ya?ml$/,
    parse({ contents }) {
      return YAML.parse(contents);
    }
  }],
  platforms: {
    scss: {
      transformGroup: 'scss',
      buildPath: 'build/scss/',
      prefix: 'rh',
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables'
        }
      ]
    },
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      prefix: 'rh',
      files: [
        {
          destination: 'global.css',
          format: 'css/variables'
        },
        {
          destination: 'shared.css',
          format: 'css/variables',
          options: {
            selector: ':host'
          }
        }
      ]
    },
    html: {
      transformGroup: 'css',
      buildPath: 'build/',
      prefix: 'rh',
      files: [
        {
          destination: 'index.html',
          format: 'html/docs',
          options: {
            outputReferences: true,
          },
        },
      ]
    },
    json: {
      transformGroup: 'css',
      buildPath: 'build/json/',
      prefix: 'rh',
      files: [{
        destination: 'tokens.json',
        format: 'json',
        options: {
          outputReferences: true
        }
      }]
    }
  }
}
