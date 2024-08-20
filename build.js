// @ts-check
import YAML from 'yaml';
import StyleDictionary from 'style-dictionary';

import * as Formats from './lib/formats.js';
import * as Transforms from './lib/transforms.js';
import * as FileHeaders from './lib/file-header.js';
import * as TransformGroups from './lib/transform-groups.js';
import * as Actions from './lib/actions.js';
import * as Filters from './lib/filters.js';
import * as Preprocessors from './lib/preprocessors.js';

import { readFile } from 'node:fs/promises';

const PLATFORMS_URL = new URL('./platforms.yaml', import.meta.url);
const platforms = YAML.parse(await readFile(PLATFORMS_URL, 'utf-8'));

export async function build() {
  const sd = new StyleDictionary({
    source: ['tokens/**/*.{yaml,yml}'],
    parsers: ['yaml'],
    platforms,
  });

  sd.registerParser({
    name: 'yaml',
    pattern: /\.ya?ml$/,
    parser: ({ contents }) => YAML.parse(contents),
  });

  sd.registerPreprocessor(Preprocessors.splitColors)

  sd.registerFileHeader(FileHeaders.legal)

  sd.registerTransform(Transforms.colorFormats)
  sd.registerTransform(Transforms.hslValue)
  sd.registerTransform(Transforms.rgbValue)
  sd.registerTransform(Transforms.remToPx)
  sd.registerTransform(Transforms.pxNumeric)
  sd.registerTransform(Transforms.mediaQuery)

  sd.registerTransformGroup(TransformGroups.css)
  sd.registerTransformGroup(TransformGroups.js)
  sd.registerTransformGroup(TransformGroups.sketch)

  sd.registerFilter(Filters.isColor)

  sd.registerFormat(Formats.litCss)
  sd.registerFormat(Formats.mapEs)
  sd.registerFormat(Formats.mapCjs)
  sd.registerFormat(Formats.metaMapEs)
  sd.registerFormat(Formats.metaMapCjs)
  sd.registerFormat(Formats.modules)
  sd.registerFormat(Formats.vscodeSnippets)
  sd.registerFormat(Formats.textmateSnippets)
  sd.registerFormat(Formats.hexokinase)
  sd.registerFormat(Formats.docsPage)

  sd.registerAction(Actions.copyAssets)
  sd.registerAction(Actions.copyTypes)
  sd.registerAction(Actions.writeEsMapDeclaration)
  sd.registerAction(Actions.writeVSIXManifest)
  sd.registerAction(Actions.descriptionFile)

  await sd.hasInitialized;
  await sd.buildAllPlatforms();
}

if (import.meta.url.endsWith(process.argv[1])) {
  await build();
}
