const YAML = require('yaml');
const StyleDictionary = require('style-dictionary');
const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs');

const env = nunjucks.configure(path.join(__dirname, 'docs'));

env.addFilter('log', function(x) { console.log(x); });

const { fileHeader, formattedVariables } = StyleDictionary.formatHelpers;

/**
 * Copy the repo license (MIT) into file headers
 */
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

/**
 * Transform a record or box-shadow properties to a css box-shadow property value
 * @see https://design-tokens.github.io/community-group/format/#shadow
 */
StyleDictionary.registerTransform({
  type: 'value',
  name: 'shadow/css',
  matcher: token => token.type === 'shadow',
  transformer: ({ value: { offsetX, offsetY, blur, spread, color }}) =>
    `${offsetX} ${offsetY} ${blur} ${spread} ${color}`,
})

/**
 * Transform an array of cubic bezier timing values to a css cubic-bezier() call
 * @see https://design-tokens.github.io/community-group/format/#cubic-bezier
 */
StyleDictionary.registerTransform({
  type: 'value',
  name: 'cubic-bezier/css',
  matcher: token => token.type === 'cubicBezier',
  transformer: ({ value }) =>
    `cubic-bezier(${value.join(', ')})`,
})

const CSS_TRANSFORMS = [
  'shadow/css',
  'cubic-bezier/css',
  'attribute/cti',
  'name/cti/kebab',
  'time/seconds',
  'content/icon',
  'size/rem',
  'color/css',
];

StyleDictionary.registerTransformGroup({ name: 'css', transforms: CSS_TRANSFORMS })
StyleDictionary.registerTransformGroup({ name: 'scss', transforms: CSS_TRANSFORMS })

/**
 * Lit CSS object
 * @example ```js
 * import { resetStyles } from '@rhds/tokens/reset.css.js';
 *
 * class RhJazzHands extends LitElement {
 *   // reset all RHDS variables to defaults
 *   static styles = [resetStyles];
 * }
 * ```
 */
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

/**
 * Exports VSCode style snippets for editor support
 */
StyleDictionary.registerFormat({
  name: 'snippets/vscode',
  formatter: ({ dictionary }) =>
    JSON.stringify(Object.fromEntries(
      dictionary.allProperties.map(prop => {
        return [
            prop.title ?? prop.name,
            {
              scope: 'css,scss',
              prefix: [
                `--${prop.name}`,
                prop.value?.startsWith?.('#') ? prop.value.replace(/^#/, '') : null
              ].filter(Boolean),
              body: [`var(--${prop.name}, ${prop.value})`],
              description: prop.comment,
            },
        ]
      })), null, 2),
});

/**
 * Generates a single-file web page to demonstrate token values
 */
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
            typeof value !== 'object' || key.match(/original|attributes|path|type/)? [] : ({
              ...value,
              name: value.name ?? color.path.reduce((a, b)=> `${a}-${b}`, 'rh') + '-' + key,
            }))
        ],
      }), {}),
    })
  }
});

module.exports = {
  source: ['tokens/**/*.{yaml,yml}'],
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
        destination: 'rhds.tokens.json',
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
        destination: 'rhds.tokens.js',
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
