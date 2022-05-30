const YAML = require('yaml');
const StyleDictionary = require('style-dictionary');
const nunjucks = require('nunjucks');
const path = require('path');

const { fileHeader, formattedVariables } = StyleDictionary.formatHelpers;

const env = nunjucks.configure(path.join(__dirname, 'docs'));

env.addFilter('log', function(x) { console.log(x); });

StyleDictionary.registerFileHeader({
  name: 'redhat/legal',
  fileHeader(defaultMessage) {
    return [
      ...defaultMessage,
      '',
      '@licence MIT',
      `Copyright © ${new Date().getFullYear()} Red Hat`,
      '',
      'Permission is hereby granted, free of charge, to any person obtaining a copy of this software',
      'and associated documentation files (the “Software”), to deal in the Software without',
      'restriction, including without limitation the rights to use, copy, modify, merge, publish,',
      'distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the',
      'Software is furnished to do so, subject to the following conditions:',
      '',
      'The above copyright notice and this permission notice shall be included in all copies or',
      'substantial portions of the Software.',
      '',
      'THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING',
      'BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND',
      'NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,',
      'DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING',
      'FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.',
    ];
  },
});

StyleDictionary.registerTransform({
  type: 'value',
  name: 'shadow/css',
  matcher: token => token.path.includes('box-shadow'),
  transformer: ({ value: { offsetX, offsetY, blur, spread, color }}) =>
    `${offsetX} ${offsetY} ${blur} ${spread} ${color}`,
})

StyleDictionary.registerTransformGroup({
  name: 'css',
  transforms: [
    'shadow/css',
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
    'shadow/css',
    'attribute/cti',
    'name/cti/kebab',
    'time/seconds',
    'content/icon',
    'size/rem',
    'color/css',
  ]
})

StyleDictionary.registerFormat({
  name: 'css/lit',
  formatter: ({ file, dictionary, options }) => `${fileHeader({file})}
import { css } from 'lit';
export const resetStyles = css\`
:host {
${formattedVariables({ format: 'css', dictionary, outputReferences: options.outputReferences })}
}\`;
export default resetStyles;`,
});

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
          format: 'scss/variables',
          options: {
            fileHeader: 'redhat/legal',
          }
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
          format: 'css/variables',
          options: {
            fileHeader: 'redhat/legal',
            selector: ':root'
          }
        }, {
          destination: 'shared.css',
          format: 'css/variables',
          options: {
            fileHeader: 'redhat/legal',
            selector: ':host'
          }
        }, {
          destination: 'reset.css.js',
          format: 'css/lit',
          options: {
            fileHeader: 'redhat/legal',
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
            fileHeader: 'redhat/legal',
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
          fileHeader: 'redhat/legal',
          outputReferences: true,
        }
      }]
    }
  }
}
