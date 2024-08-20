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

export async function build() {
  const yamlPlatforms = await readFile(new URL('./platforms.yaml', import.meta.url), 'utf-8');
  const platforms = YAML.parse(yamlPlatforms as unknown as string);

  const sd = new StyleDictionary();

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

  await sd.extend({
    source: [
      'tokens/**/*.{yaml,yml}',
    ],
    parsers: [
      'yaml',
    ],
    preprocessors: ['split-colors'],
    platforms,
  })

  await sd.hasInitialized;
  await sd.buildAllPlatforms();
}

if (import.meta.url.endsWith(process.argv[1])) {
  await build();
}
