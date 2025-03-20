import type { DesignToken, PreprocessedTokens } from 'style-dictionary/types';

import YAML from 'yaml';
import StyleDictionary from 'style-dictionary';

import * as Formats from './lib/formats.ts';
import * as Transforms from './lib/transforms.ts';
import * as FileHeaders from './lib/file-header.ts';
import * as TransformGroups from './lib/transform-groups.ts';
import * as Actions from './lib/actions.ts';
import * as Filters from './lib/filters.ts';
import * as Preprocessors from './lib/preprocessors.ts';

import { readFile } from 'node:fs/promises';

/**
 * Build the style dictionary
 */
export async function build(): Promise<void> {
  const platformsUrl = new URL('./platforms.yaml', import.meta.url);
  const yamlPlatforms = await readFile(platformsUrl, 'utf-8');
  if (typeof yamlPlatforms !== 'string') {
    throw new Error('Bad Platforms');
  }

  const platforms = YAML.parse(yamlPlatforms);

  const sd = new StyleDictionary({
    hooks: {
      parsers: {
        yaml: {
          pattern: /\.ya?ml$/,
          parser: ({ contents }) => YAML.parse(contents),
        },
      },
    },
    parsers: ['yaml'],
    preprocessors: ['split-colors', 'wtf-description'],
    source: [
      'tokens/**/*.yml',
      'tokens/**/*.yaml',
    ],
    platforms,
    log: {
      verbosity: 'verbose',
    },
  });

  sd.registerPreprocessor({
    name: 'wtf-description',
    preprocessor(dictionary) {
      function fixDescription(slice: PreprocessedTokens) {
        if (slice.$description && typeof slice.$description !== 'string') {
          (slice as DesignToken).$description =
            Array.from((slice as DesignToken).$description).join('');
        }

        for (const key in slice) {
          if (Object.prototype.hasOwnProperty.call(slice, key)) {
            const token = slice[key];
            if (typeof token !== 'object' || token === null) {
              continue;
            } else {
              fixDescription(token);
            }
          }
        }
      }
      fixDescription(dictionary);
      return dictionary;
    },
  });
  sd.registerPreprocessor(Preprocessors.splitColors);

  sd.registerFileHeader({ name: 'redhat/legal', fileHeader: FileHeaders.legal });

  sd.registerTransform(Transforms.colorFormats);
  sd.registerTransform(Transforms.hslValue);
  sd.registerTransform(Transforms.rgbValue);
  sd.registerTransform(Transforms.themeTokens);
  sd.registerTransform(Transforms.remToPx);
  sd.registerTransform(Transforms.pxNumeric);
  sd.registerTransform(Transforms.mediaQuery);

  sd.registerTransformGroup(TransformGroups.css);
  sd.registerTransformGroup(TransformGroups.js);
  sd.registerTransformGroup(TransformGroups.sketch);

  sd.registerFilter(Filters.isColor);
  sd.registerFilter(Filters.isThemeColorToken);
  sd.registerFilter(Filters.isNotThemeColorToken);
  sd.registerFilter(Filters.isLightThemeColorToken);
  sd.registerFilter(Filters.isDarkThemeColorToken);

  sd.registerFormat(Formats.litCss);
  sd.registerFormat(Formats.cssRhdsDefaultTheme);
  sd.registerFormat(Formats.cssRhdsColorPalette);
  sd.registerFormat(Formats.jsRhdsDefaultTheme);
  sd.registerFormat(Formats.jsRhdsColorPalette);
  sd.registerFormat(Formats.mapTs);
  sd.registerFormat(Formats.mapCjs);
  sd.registerFormat(Formats.metaMapTs);
  sd.registerFormat(Formats.metaMapCjs);
  sd.registerFormat(Formats.modules);
  sd.registerFormat(Formats.vscodeSnippets);
  sd.registerFormat(Formats.textmateSnippets);
  sd.registerFormat(Formats.hexokinaseRefs);
  sd.registerFormat(Formats.hexokinaseVars);
  sd.registerFormat(Formats.nvimColorizer);
  sd.registerFormat(Formats.docsPage);

  sd.registerAction(Actions.compile);
  sd.registerAction(Actions.copyAssets);
  sd.registerAction(Actions.writeVSIXManifest);
  sd.registerAction(Actions.descriptionFile);

  await sd.hasInitialized;
  await sd.buildAllPlatforms();
}

if (import.meta.url.endsWith(process.argv[1])) {
  await build();
}
