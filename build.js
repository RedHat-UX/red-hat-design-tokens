//@ts-check
//
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import Color from 'tinycolor2';
import YAML from 'yaml';
import StyleDictionary from 'style-dictionary';

import flattenTokens from 'style-dictionary/lib/utils/flattenProperties.js';
import nunjucks from 'nunjucks';
import slugify from '@sindresorhus/slugify';
import markdownit from 'markdown-it';
import hljs from 'highlight.js';

const md = markdownit({
  html: true,
  linkify: true,
  highlight(str, language) {
    if (hljs.getLanguage(language)) {
      try {
        return hljs.highlight(str, { language }).value;
      } catch(e) {
        console.error(e)
        return str;
      }
    }
  }
});

const env = nunjucks.configure(fileURLToPath(new URL('./docs', import.meta.url)));

const { fileHeader, formattedVariables } = StyleDictionary.formatHelpers;

/** OpenFont weight string aliases */
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

const isColor = token => token.$type === 'color' || token.path.includes('color');
const isShadow = token => token.$type === 'shadow';
const isCubicBezier = token => token.$type === 'cubicBezier';
const isFontFamily = token => token.$type === 'fontFamily';
const isFontWeight = token => token.$type === 'fontWeight';
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
 * Copy the repo license (MIT) into file headers
 */
StyleDictionary.registerFileHeader({ name: 'redhat/legal',
  fileHeader(defaultMessage) {
    return [
      ...defaultMessage,
      '',
      '@license',
      ...fs.readFileSync(fileURLToPath(new URL('./LICENSE', import.meta.url)), 'utf8').split('\n'),
    ];
  },
});

/** Match tokens which contain `-color-` in the css variable name */
StyleDictionary.registerFilter({ name: 'isColor', matcher(token) {
  return Object.values(token.attributes).some(x => x === 'color' )
}});

/**
 * Transform a record or box-shadow properties to a css box-shadow property value
 * @see https://design-tokens.github.io/community-group/format/#shadow
 */
StyleDictionary.registerTransform({ name: 'dtcg/type/color',
  type: 'attribute',
  transitive: true,
  matcher: isColor,
  transformer: (token) => {
    token.$type ??= 'color';
    return token.attributes;
  },
});

/**
 * Transform a record or box-shadow properties to a css box-shadow property value
 * @see https://design-tokens.github.io/community-group/format/#shadow
 */
StyleDictionary.registerTransform({ name: 'dtcg/shadow/css',
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
StyleDictionary.registerTransform({ name: 'dtcg/cubic-bezier/css',
  type: 'value',
  matcher: isCubicBezier,
  transformer: ({ value }) =>
    `cubic-bezier(${value.join(', ')})`,
})

/**
 * Transform an array of font family specifiers to a comma separated list
 * @see https://design-tokens.github.io/community-group/format/#font-family
 */
StyleDictionary.registerTransform({ name: 'dtcg/font-family/css',
  type: 'value',
  matcher: isFontFamily,
  transformer: /**@param {{value: string[]}} value */({ value }) =>
    `${value.map(x => x.match(/\s/) ? `"${x}"` : x).join(', ')}`,
})

/**
 * Add px values for rem-based tokens, assuming default 16px base px font size
 */
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

/**
 * Add font weight string aliases to font-weight types
 */
StyleDictionary.registerTransform({ name: 'dtcg/font-weight/css',
  transitive: true,
  type: 'value',
  matcher: isFontWeight,
  transformer: function(token) {
    token.attributes.aliases = WGHT_ALIASES[token.value];
    return token.value;
  }
});

/**
 * Add HEX, RGB, HSL, HSV, and isLight (boolean) to colour types
 */
StyleDictionary.registerTransform({ name: 'attribute/color',
  type: 'attribute',
  matcher: isColor,
  transformer: function (token) {
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

/** Transforms to apply to s/css outputs */
StyleDictionary.registerTransformGroup({ name: 'css', transforms: [
  'dtcg/cubic-bezier/css',
  'dtcg/font-family/css',
  'dtcg/font-weight/css',
  'dtcg/shadow/css',
  'dtcg/type/color',
  'attribute/cti',
  'attribute/color',
  'name/cti/kebab',
  'time/seconds',
  'content/icon',
  // 'size/rem',
  // 'remToPx/css',
  'color/css',
] });

/** Transforms to apply to s/css outputs */
StyleDictionary.registerTransformGroup({ name: 'js', transforms: [
  'dtcg/cubic-bezier/css',
  'dtcg/font-family/css',
  'dtcg/font-weight/css',
  'dtcg/shadow/css',
  'dtcg/type/color',
  ...StyleDictionary.transformGroup.js] });

/** Transforms to apply to s/css outputs */
StyleDictionary.registerTransformGroup({ name: 'sketch', transforms: [
  'dtcg/type/color',
  'attribute/cti',
  'attribute/color',
  'name/cti/kebab',
  'color/sketch',
] });

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

const makeEntries = dictionary =>
  JSON.stringify(dictionary.allTokens.map(x => [`--${x.name}`, x.value]), null, 2);

/**
 * JavaScript token map
 * @example ```js
 * import { tokens } from '@rhds/tokens';
 *
 * const fontfamilyCssString = tokens.get('--rh-font-family-body-text');
 * // e.g. 'RedHatText, "Red Hat Text", Overpass, sans-serif';
 * ```
 */
StyleDictionary.registerFormat({ name: 'javascript/map',
  formatter: ({ file, dictionary, options }) => `${fileHeader({file})}
export const tokens = new Map(${makeEntries(dictionary)});`,
}).registerFormat({ name: 'javascript/map-cjs',
  formatter: ({ file, dictionary, options }) => `${fileHeader({file})}
exports.tokens = new Map(${makeEntries(dictionary)});`,
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

/**
 * Exports [vim-hexokinase](https://github.com/RRethy/vim-hexokinase) custom patterns
 */
StyleDictionary.registerFormat({ name: 'editor/hexokinase',
  formatter: ({ dictionary }) =>
    JSON.stringify({
      regex_pattern: '\\{color\\.(\\+)\.(\\d{1,3})\\}',
      colour_table: Object.fromEntries(
      dictionary.allTokens.filter(isColor).flatMap(pairAliasWithValue).sort())
    }, null, 2),
});

/**
 * Generates a single-file web page to demonstrate token values
 */
StyleDictionary.registerFormat({ name: 'html/docs',
  formatter({ dictionary, platform }) {
    const getDocs = x => x?.$extensions?.['com.redhat.ux']
    const getColorGroupOrder = x => getDocs(dictionary.tokens.color[x])?.order ?? Infinity;
    const filterEntries = (p, x) => Object.fromEntries(Object.entries(x).filter(p));
    const sortEntries = (p, x) => Object.fromEntries(Object.entries(x).sort(p));
    const entryHasValue = ([_, v]) => typeof v === 'object' && 'value' in v;
    env.addFilter('log', x => console.log(x));
    env.addFilter('trace', x => (console.log(x), x));
    env.addFilter('isRef', x => x?.original?.value?.startsWith?.('{') ?? false);
    env.addFilter('deref', x => `rh-${x.original.value.replace(/[{}]/g, '').split('.').join('-')}`);
    env.addFilter('slugify', x => slugify(x))
    env.addFilter('getValues', x => filterEntries(entryHasValue, x));
    env.addFilter('flattenTokens', flattenTokens);
    env.addFilter('getDocs', getDocs);
    env.addFilter('getDescription', x => md.render(x?.description ?? ''));
    env.addFilter('colors', x => x?.filter(isColor));
    env.addFilter('excludekeys', (x, ...keys) => filterEntries(([k]) => !keys.includes(k), x));
    env.addFilter('pickkeys', (x, ...keys) => filterEntries(([k]) => keys.includes(k), x));
    env.addFilter('stripmeta', x => filterEntries(([k]) => k !== 'comment' && !k.startsWith('$'), x ?? {}));
    env.addFilter('sortColorGroupByOrder', x => sortEntries(([a], [b]) => getColorGroupOrder(a) - getColorGroupOrder(b), x));
    env.addFilter('buildCollection', name => ({
      ...dictionary.tokens[name],
      ...filterEntries(([_, v]) => getDocs(v)?.category === name, dictionary.tokens.color)
    }));
    return env.render('index.html', { ...dictionary, platform });
  }
});

const DOCS_STYLES_IN = fileURLToPath(new URL('./docs/styles.css', import.meta.url));
const DOCS_STYLES_OUT = fileURLToPath(new URL('./build/styles.css', import.meta.url));

/** Copy web assets to build dir */
StyleDictionary.registerAction({ name: 'copyAssets',
  do() {
    fs.copyFileSync(DOCS_STYLES_IN, DOCS_STYLES_OUT)
  },
  undo() {
    fs.rmSync(DOCS_STYLES_OUT, {
      force: true,
    });
  }
});

StyleDictionary.extend({
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
      transformGroup: 'css',
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

    map: {
      transformGroup: 'css',
      buildPath: 'js/',
      prefix: 'rh',
      files: [{
        destination: 'tokens.js',
        format: 'javascript/map',
      }, {
        destination: 'tokens.cjs',
        format: 'javascript/map-cjs',
      }]
    },

    js: {
      transformGroup: 'js',
      buildPath: 'js/',
      files: [{
        destination: 'tree.js',
        format: 'javascript/es6',
        options: {
          fileHeader: 'redhat/legal',
        },
      }, {
        destination: 'tree.d.ts',
        format: 'typescript/es6-declarations',
        options: {
          fileHeader: 'redhat/legal',
        },
      }, {
        destination: 'values.cjs',
        format: 'javascript/module-flat',
        options: {
          fileHeader: 'redhat/legal',
        },
      }, {
        destination: 'values.d.cts',
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
      actions: ['copyAssets'],
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
    },

    sketch: {
      transformGroup: 'sketch',
      buildPath: 'design/',
      prefix: 'rh',
      files: [{
        destination: 'rhds.sketchpalette',
        format: 'sketch/palette/v2',
        filter: 'isColor',
      }, {
        destination: '../build/rhds.sketchpalette',
        format: 'sketch/palette/v2',
        filter: 'isColor',
      }],
    }
  }
}).buildAllPlatforms();
