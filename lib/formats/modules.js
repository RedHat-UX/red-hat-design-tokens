import StyleDictionary from 'style-dictionary';
import * as Predicates from '../predicates.js';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { colorFormats } from '../transforms.js';

const { fileHeader } = StyleDictionary.formatHelpers;

function deserializeShadow(x) {
  const [offsetX, offsetY, blur, spread, color] = x.split(' ');
  return { offsetX, offsetY, blur, spread, color };
}

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
    const categories = new Set(dictionary.allTokens.map(x => x.attributes.category));
    for (const name of categories) {
      const category = dictionary.allTokens.filter(x => x.attributes?.category === name);
      const outpath = join(process.cwd(), platform.buildPath, `${name}.js`);
      const content = category
        .filter(x => !Predicates.isColor(x) || !x.name.match(/(rgb|hsl)$/i))
        .map(x => {
          const value =
              Predicates.isColor(x) ? colorFormats.transformer({ ...x })
            : Predicates.isShadow(x) ? deserializeShadow(x.$value)
            : x.$value;
          return `export const ${x.name} = ${JSON.stringify(value)};`;
        })
        .join('\n');
      writeFileSync(outpath, content, 'utf8');
    }
    return [
      fileHeader({ file }),
      ...Array.from(categories, x => `export * from './${x}.js';`),
    ].join('\n');
  },
};
