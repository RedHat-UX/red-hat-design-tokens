const YAML = require('yaml');
const StyleDictionary = require('style-dictionary');
const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs');

const { fileHeader, formattedVariables } = StyleDictionary.formatHelpers;
const env = nunjucks.configure(path.join(__dirname, 'docs'));

env.addFilter('log', function(x) { console.log(x); });

StyleDictionary.registerFileHeader({
  name: 'redhat/legal',
  fileHeader(defaultMessage) {
    return [
      ...defaultMessage,
      '',
      '@license',
      ...fs.readFileSync(path.join(__dirname, 'LICENSE'), 'utf8').split('\n'),
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
  name: 'snippets/vscode',
  formatter: ({ dictionary }) =>
    JSON.stringify(Object.fromEntries(
      dictionary.allProperties.map(prop => [
        prop.title ?? prop.name,
        {
          scope: 'css,scss',
          // prefix: prop.path.reduce((prefixes, path) => [...prefixes, `${prefixes.at(-1)}-${path}`], ['--rh']),
          prefix:[  `--${prop.name}`],
          body: [`var(--${prop.name}, ${prop.value})`],
          description: prop.comment,
        }
      ])
    ), null, 2),
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
      }, ]
    },

    js: {
      transformGroup: 'js',
      buildPath: 'build/js/',
      files: [{
        destination: 'tokens.js',
        format: 'javascript/es6',
        options: {
          fileHeader: 'redhat/legal',
        },
      }, {
        destination: 'tokens.d.ts',
        format: 'typescript/es6-declarations',
        options: {
          fileHeader: 'redhat/legal',
        },
      }, {
        destination: 'tokens.cjs',
        format: 'javascript/module-flat',
        options: {
          fileHeader: 'redhat/legal',
        },
      }, {
        destination: 'tokens.d.cts',
        format: 'typescript/es6-declarations',
        options: {
          fileHeader: 'redhat/legal',
        },
      }]
    },

    html: {
      transformGroup: 'css',
      buildPath: 'build/',
      prefix: 'rh',
      files: [{
        destination: 'index.html',
        format: 'html/docs',
        options: {
          fileHeader: 'redhat/legal',
          outputReferences: true,
        },
      }]
    },

    snippets: {
      transformGroup: 'css',
      buildPath: 'build/snippets/',
      prefix: 'rh',
      files: [{
        destination: 'vscode.json',
        format: 'snippets/vscode',
      }]
    }
  }
}
