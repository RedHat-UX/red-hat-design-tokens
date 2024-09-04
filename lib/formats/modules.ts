import type { Format } from 'style-dictionary/types';
import type { Token } from 'style-dictionary';

import { mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';

import * as Predicates from '../predicates.ts';

import { fileHeader } from 'style-dictionary/utils';
import { colorFormats } from '../transforms.ts';

function camelcase(str: string): string {
  const a = str.toLowerCase()
      .replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
  return a.substring(0, 1).toLowerCase() + a.substring(1);
}

function deserializeShadow(x: Token) {
  if (typeof x.$value === 'object') {
    return JSON.stringify(x.$value);
  } else {
    const [offsetX, offsetY, blur, spread, color] = x.$value.split(' ');
    return JSON.stringify({ offsetX, offsetY, blur, spread, color });
  }
}

const capitalize = (x: string) => `${x.at(0).toUpperCase()}${x.slice(1)}`;

function mediaRef(x: Token) {
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
 * @example ```js
 *          import { Red300 } from '@rhds/tokens/color.js';
 *          ```
 */
export const modules: Format = {
  name: 'javascript/modules',
  async format({ file, dictionary, platform, options }) {
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
              Predicates.isColor(x) ? JSON.stringify(colorFormats.transform(
                structuredClone(x),
                platform,
                options,
              ))
            : Predicates.isShadow(x) ? deserializeShadow(x)
            : Predicates.isMediaQuery(x) ? mediaRef(x)
            : JSON.stringify(x.$value);
            return `export const ${capitalize(camelcase(x.name))}${Predicates.isColor(x) ? ': Color' : ''} = ${value};`;
          });
      const hasColors = category.some(x => Predicates.isColor(x));
      const contents = [
        await fileHeader({ file }),
        ...!hasColors ? [] : ['import type { Color } from "./types.js";'],
        ...defs,
      ].join('\n');

      await mkdir(dirname(outpath), { recursive: true });
      await writeFile(outpath, contents, 'utf8');
    }
    const content = [
      await fileHeader({ file }),
      ...Array.from(categories, x => `export * from './${x}.js';`),
    ].join('\n');
    return content;
  },
};
