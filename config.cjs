const YAML = require('yaml');
const StyleDictionary = require('style-dictionary');
const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs');

const env = nunjucks.configure(path.join(__dirname, 'docs'));

env.addFilter('log', function(x) { console.log(x); });

const { fileHeader, formattedVariables } = StyleDictionary.formatHelpers;

const isColor = token => token.type === 'color' || token.path.includes('color');
const isShadow = token => token.type === 'shadow';
const isCubicBezier = token => token.type === 'cubicBezier';
const isFontFamily = token => token.type === 'fontFamily';
const isFontWeight = token => token.type === 'fontWeight';

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
StyleDictionary.registerTransform({ name: 'shadow/css',
  type: 'value',
  transitive: true,
  matcher: isShadow,
  transformer: (token) =>
    `${token.value.offsetX} ${token.value.offsetY} ${token.value.blur} ${token.value.spread} ${token.value.color}`,
})

/**
 * Transform an array of cubic bezier timing values to a css cubic-bezier() call
 * @see https://design-tokens.github.io/community-group/format/#cubic-bezier
 */
StyleDictionary.registerTransform({ name: 'cubic-bezier/css',
  type: 'value',
  matcher: isCubicBezier,
  transformer: ({ value }) =>
    `cubic-bezier(${value.join(', ')})`,
})

/**
 * Transform an array of font family specifiers to a comma separated list
 * @see https://design-tokens.github.io/community-group/format/#font-family
 */
StyleDictionary.registerTransform({ name: 'font-family/css',
  type: 'value',
  matcher: isFontFamily,
  transformer: ({ value }) =>
    `${value.join(', ')}`,
})

StyleDictionary.registerTransform({ name: 'remToPx/css',
  type: 'value',
  transitive: true,
  matcher: token => token.value?.endsWith?.('rem'),
  transformer: function(token, options) {
    const val = parseFloat(token.value);
    const baseFont = options?.basePxFontSize || 16;
    if (Number.isNaN(val)) {
      throw new Error(`Invalid Number: '${token.name}: ${token.value}' is not a valid number, cannot transform to 'px' \n`);
    }
    token.attributes.px = (val * baseFont).toFixed(0) + 'px';
    return token.value;
  }
});

const WGHT_ALIASES = {
  100: ['thin', 'hairline'],
  200: ['extra-light', 'ultra-light'],
  300: ['light'],
  400: ['regular', 'normal', 'book'],
  500: ['medium',],
  600: ['semi-bold', 'demi-bold'],
  700: ['bold'],
  800: ['extra-bold', 'ultra-bold'],
  900: ['black', 'heavy'],
  950: ['extra-black', 'ultra-black']
}

StyleDictionary.registerTransform({ name: 'font-weight/css',
  transitive: true,
  type: 'value',
  matcher: isFontWeight,
  transformer: function(token) {
    token.attributes.aliases = WGHT_ALIASES[token.value];
    return token.value;
  }
});

StyleDictionary.registerTransform({ name: 'attribute/color',
  type: 'attribute',
  matcher: isColor,
  transformer: function (token) {
    const Color = require('tinycolor2');
    const color = Color(token.value);
    return {
      hex: color.toHex(),
      rgb: color.toRgb(),
      hsl: color.toHsl(),
      hsv: color.toHsv(),
      isLight: color.isLight(),
    }
  },
});

const CSS_TRANSFORMS = [
  'attribute/cti',
  'attribute/color',
  'name/cti/kebab',
  'time/seconds',
  'content/icon',
  'size/rem',
  'cubic-bezier/css',
  'remToPx/css',
  'shadow/css',
  'color/css',
  'font-family/css',
  'font-weight/css',
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
StyleDictionary.registerFormat({ name: 'css/lit',
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
StyleDictionary.registerFormat({ name: 'snippets/vscode',
  formatter: ({ dictionary }) =>
    JSON.stringify(Object.fromEntries(
      dictionary.allTokens.map(token => {
        return [
            token.title ?? token.name,
            {
              scope: 'css,scss',
              prefix: [
                `--${token.name}`,
                token.value?.startsWith?.('#') ? token.value.replace(/^#/, '') : null
              ].filter(Boolean),
              body: [`var(--${token.name}, ${token.value})`],
              description: token.comment,
            },
        ]
      })), null, 2),
});

const pairAliasWithValue = token => {
  if (typeof token.value === 'string') {
    const name = token.original?.value?.startsWith('{') ? token.original.value.replace(/\._}$/, '}') : `{${token.path.reduce((a, b) => `${a}.${b}`, '')}}`.replace(/^\{\./, '{');
    return [ [ name, token.value ] ];
  } else if (token.value) {
    return Object.fromEntries(Object.entries(token.value).map(pairAliasWithValue))
  } else {
    return []
  }
}

/**
 * Exports [vim-hexokinase](https://github.com/RRethy/vim-hexokinase) custom patterns
 */
StyleDictionary.registerFormat({ name: 'editor/hexokinase',
  formatter: ({ dictionary }) =>
    JSON.stringify({
      regex_pattern: '\\{color\\.(\\w+)\.(\\d{1,3})\\}',
      colour_table: Object.fromEntries(
      dictionary.allTokens.filter(isColor).flatMap(pairAliasWithValue).sort())
    }, null, 2),
});

/**
 * Generates a single-file web page to demonstrate token values
 */
StyleDictionary.registerFormat({ name: 'html/docs',
  formatter({ dictionary, platform }) {
    fs.copyFileSync(path.join(__dirname, 'docs', 'styles.css'), path.join(__dirname, 'build', 'styles.css'))
    const colors = dictionary.allTokens
      .filter(isColor)
      .sort((a, b) => (dictionary.tokens.color[a.attributes.type]?.order ?? Infinity) - (dictionary.tokens.color[b.attributes.type]?.order ?? Infinity))
      .reduce((acc, color) => ({
        ...acc,
        [color.attributes.type]: {
          values: [
            ...acc[color.attributes.type]?.values ?? [],
            color,
            ...Object.entries(color).flatMap(([key, value]) =>
              typeof value !== 'object' || key.match(/original|attributes|path|type/)? [] : ({
                ...value,
                name: value.name ?? color.path.reduce((a, b)=> `${a}-${b}`, 'rh') + '-' + key,
              }))
          ]
        },
      }), {});
    return env.render('index.html', {
      dictionary,
      platform,
      colors,
    });
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
      buildPath: 'css/',
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
      buildPath: 'scss/',
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
      buildPath: 'json/',
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
      buildPath: 'js/',
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
      }, {
        destination: 'rhds.css',
        format: 'css/variables',
        options: {
          fileHeader: 'redhat/legal',
          selector: ':root'
        }
      }]
    },

    editor: {
      transformGroup: 'css',
      buildPath: 'editor/',
      prefix: 'rh',
      files: [{
        destination: 'vscode.json',
        format: 'snippets/vscode',
      }, {
        destination: 'hexokinase.json',
        format: 'editor/hexokinase',
      }]
    }
  }
}
