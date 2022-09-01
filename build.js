import YAML from 'yaml';
import StyleDictionary from 'style-dictionary';

import * as Formats from './lib/formats.js';
import * as DTCGTransforms from './lib/transforms/dtcg.js';
import * as Transforms from './lib/transforms.js';
import * as FileHeaders from './lib/file-header.js';
import * as TransformGroups from './lib/transform-groups.js';
import * as Actions from './lib/actions.js';
import * as Filters from './lib/filters.js';

import { readFile } from 'node:fs/promises';

const platformsYAML =
  await readFile(new URL('./platforms.yaml', import.meta.url), 'utf8');

StyleDictionary
  .registerFileHeader(FileHeaders.legal)
  .registerFilter(Filters.isColor)
  .registerTransform(DTCGTransforms.typeColor)
  .registerTransform(DTCGTransforms.shadow)
  .registerTransform(DTCGTransforms.cubicBezier)
  .registerTransform(DTCGTransforms.fontFamily)
  .registerTransform(DTCGTransforms.fontWeight)
  .registerTransform(Transforms.colorFormats)
  .registerTransform(Transforms.remToPx)
  .registerTransformGroup(TransformGroups.css)
  .registerTransformGroup(TransformGroups.js)
  .registerTransformGroup(TransformGroups.sketch)
  .registerFormat(Formats.litCss)
  .registerFormat(Formats.mapEs)
  .registerFormat(Formats.mapCjs)
  .registerFormat(Formats.vscodeSnippets)
  .registerFormat(Formats.hexokinase)
  .registerFormat(Formats.docsPage)
  .registerAction(Actions.copyAssets)
  .registerAction(Actions.writeEsMapDeclaration)
  .extend({
    source: ['tokens/**/*.{yaml,yml}'],
    platforms: YAML.parse(platformsYAML),
    parsers: [{
      pattern: /\.ya?ml$/,
      parse({ contents }) {
        return YAML.parse(contents);
      }
    }],
  })
  .buildAllPlatforms();
