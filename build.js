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

const PLATFORMS_URL = new URL('./platforms.yaml', import.meta.url);
const platforms = YAML.parse(await readFile(PLATFORMS_URL, 'utf8'));

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
  .registerFormat(Formats.textmateSnippets)
  .registerFormat(Formats.hexokinase)
  .registerFormat(Formats.docsPage)
  .registerAction(Actions.copyAssets)
  .registerAction(Actions.writeEsMapDeclaration)
  .registerAction(Actions.writeVSIXManifest)
  .extend({
    source: ['tokens/**/*.{yaml,yml}'],
    platforms,
    parsers: [{
      pattern: /\.ya?ml$/,
      parse({ contents }) {
        return YAML.parse(contents);
      }
    }],
  })
  .buildAllPlatforms();
