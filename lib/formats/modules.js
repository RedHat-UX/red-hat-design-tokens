import StyleDictionary from 'style-dictionary';
import * as Predicates from '../predicates.js';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { colorFormats } from '../transforms.js';

const { fileHeader } = StyleDictionary.formatHelpers;

function deserializeShadow(x) {
  const [offsetX, offsetY, blur, spread, color] = x.$value.split(' ');
  return JSON.stringify({ offsetX, offsetY, blur, spread, color });
}

const capitalize = x => `${x.at(0).toUpperCase()}${x.slice(1)}`;

function colorRef(x) {
  const r = JSON.stringify(colorFormats.transformer({ ...x }));
  return r;
}

function mediaRef(x) {
  const values = [];
  const stringified = JSON.stringify(x.original.$value, (_, value) => {
    const [, inner] = value?.match?.(/^\{(.*)\}$/) ?? [];
    if (inner) {
      const v = inner.split('.').map(capitalize).join('');
      values.push(v);
      return v.replace(/"(.*)"/, '$1');
    } else {
      return value;
    }
  });
  const r = `${stringified.replace(new RegExp(`"(${values.join('|')})"`), '$1')} as const`;
  return r;
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
      const outpath = join(process.cwd(), platform.buildPath, `${name}.ts`);
      const category = dictionary
        .allTokens
        .filter(x => x.attributes?.category === name)
        // don't output -rgb and -hsl tokens, because colours here are structured data which includes hsl and rgb values
        .filter(x => !Predicates.isColor(x) || !x.name.match(/(rgb|hsl)$/i));
      const defs = category
        .map(x => {
          const value =
              Predicates.isColor(x) ? colorRef(x)
            : Predicates.isShadow(x) ? deserializeShadow(x)
            : Predicates.isMediaQuery(x) ? mediaRef(x)
            : JSON.stringify(x.$value);
          return `export const ${x.name}${Predicates.isColor(x) ? ': Color' : ''} = ${value};`;
        });
      const hasColors = category.some(x => Predicates.isColor(x));
      const contents = [
        fileHeader({ file }),
        ...!hasColors ? [] : ['import type { Color } from "./types.js";'],
        ...defs
      ].join('\n');
      writeFileSync(outpath, contents, 'utf8');
    }
    return [
      fileHeader({ file }),
      ...Array.from(categories, x => `export * from './${x}.js';`),
    ].join('\n');
  },
};
