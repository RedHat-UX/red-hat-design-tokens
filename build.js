import YAML from 'yaml';
import StyleDictionary from 'style-dictionary';

import * as Formats from './lib/formats.js';
import * as DTCGTransforms from './lib/transforms/dtcg.js';
import * as Transforms from './lib/transforms.js';
import * as FileHeaders from './lib/file-header.js';
import * as TransformGroups from './lib/transform-groups.js';
import * as Actions from './lib/actions.js';
import * as Filters from './lib/filters.js';

import { readFile, readdir } from 'node:fs/promises';

const CRAYONS = new Set((await readdir(new URL('./tokens/color/crayon', import.meta.url))).map(x => x.replace(/\.ya?ml/, '')));
CRAYONS.add('white');
CRAYONS.add('black');
const PLATFORMS_URL = new URL('./platforms.yaml', import.meta.url);
const platforms = YAML.parse(await readFile(PLATFORMS_URL, 'utf8'));

export function build() {
  StyleDictionary
    .registerFileHeader(FileHeaders.legal)
    .registerFilter(Filters.isColor)
    .registerTransform(DTCGTransforms.value)
    .registerTransform(DTCGTransforms.description)
    .registerTransform(DTCGTransforms.typeNested)
    .registerTransform(DTCGTransforms.shadow)
    .registerTransform(DTCGTransforms.cubicBezier)
    .registerTransform(DTCGTransforms.fontFamily)
    .registerTransform(DTCGTransforms.fontWeight)
    .registerTransform(Transforms.colorFormats)
    .registerTransform(Transforms.hslValue)
    .registerTransform(Transforms.rgbValue)
    .registerTransform(Transforms.remToPx)
    .registerTransform(Transforms.pxNumeric)
    .registerTransform(Transforms.mediaQuery)
    .registerTransformGroup(TransformGroups.css)
    .registerTransformGroup(TransformGroups.js)
    .registerTransformGroup(TransformGroups.sketch)
    .registerFormat(Formats.litCss)
    .registerFormat(Formats.highlightjsCss)
    .registerFormat(Formats.prismCss)
    .registerFormat(Formats.mapEs)
    .registerFormat(Formats.mapCjs)
    .registerFormat(Formats.modules)
    .registerFormat(Formats.vscodeSnippets)
    .registerFormat(Formats.textmateSnippets)
    .registerFormat(Formats.hexokinase)
    .registerFormat(Formats.docsPage)
    .registerAction(Actions.copyAssets)
    .registerAction(Actions.copyTypes)
    .registerAction(Actions.writeEsMapDeclaration)
    .registerAction(Actions.writeVSIXManifest)
    .registerAction(Actions.descriptionFile)
    .extend({
      source: ['tokens/**/*.{yaml,yml}'],
      platforms,
      parsers: [{
        pattern: /\.ya?ml$/,
        parse({ contents, filePath }) {
          const isCrayon = filePath.split('/').includes('crayon');
          return YAML.parse(contents,
            /**
             * Transform `$value` (DTCG syntax) to `value` (style-dictionary syntax)
             * @this {*}
             */
            function(key, value) {
              if ('$value' in this) {
                this.value = this.$value;
              }

              // TODO: until https://github.com/amzn/style-dictionary/issues/695#issuecomment-1378374851 lands,
              // we pre-process our YAML sources to make it appear they contain `color.${crayonName}.${tone}.${'rgb'|'hsl'}` tokens,
              // which alias to the token values.
              if (isCrayon && key === 'color') {
                return Object.fromEntries(Object.entries(value).map(([color, tones]) => {
                  if (!CRAYONS.has(color)) {
                    return [color, tones];
                  } else {
                    const all = Object.keys(tones)
                      .flatMap(tone => {
                        const $value = `{color.${color}.${tone}}`;
                        const $type = 'color';
                        return [
                          [tone, tones[tone]],
                          ...tone.match(/^(\$|attributes|value)/) ? [] : [
                            [`${tone}-hsl`, { $type, $value, value: $value }],
                            [`${tone}-rgb`, { $type, $value, value: $value }],
                          ]
                        ];
                      });
                    return [color, Object.fromEntries(all)];
                  }
                }));
              }

              return value;
            });
        }
      }],
    })
    .buildAllPlatforms();
}

if (import.meta.url.endsWith(process.argv[1])) {
  build();
}
