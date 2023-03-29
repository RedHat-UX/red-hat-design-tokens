import StyleDictionary from 'style-dictionary';
import * as Predicates from '../predicates.js';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { mediaQuery } from '../transforms/media.js';

const { fileHeader } = StyleDictionary.formatHelpers;

const makeEntries = dictionary => dictionary.allTokens.map(x => [`--${x.name}`, x.value]);

/**
 * Per-category javascript modules
 * @type {import('style-dictionary').Format}
 * @example ```js
 * import { Red300 } from '@rhds/tokens/color.js';
 * ```
 */
export const modules = {
  name: 'javascript/modules',
  formatter({ file, dictionary, platform }) {
    const categories = Object.keys(dictionary.tokens);
    for (const name of categories) {
      const category = dictionary.allTokens.filter(x => x.path.at(0) === name);
      const outpath = join(process.cwd(), platform.buildPath, `${name}.js`);
      const content = category.map(x => `export const ${x.name} = '${Predicates.isMediaQuery(x) ? mediaQuery.transformer({ ...x }) : x.value}';`).join('\n');
      writeFileSync(outpath, content, 'utf8');
    }
    return [
      fileHeader({ file }),
      ...categories.map(x => `export * from './${x}.js';`),
    ].join('\n');
  },
};
