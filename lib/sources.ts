import type { DesignToken } from 'style-dictionary/types';

import YAML from 'yaml';
import { readFile, glob } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

import deepmerge from 'deepmerge';

const cwd = fileURLToPath(new URL('../tokens/', import.meta.url));

const files = [];
for await (const file of glob('**/*.y?(a)ml', { cwd })) {
  files.push(join(cwd, file));
}

const parsed = await Promise.all(files.map(async x => YAML.parse(await readFile(x, 'utf8'))));

/** merged static tokens sources files */
export const sources = deepmerge.all(parsed);

/**
 * retrieve the `$type` from the token or its group
 * @param tokenOrCollection token or collection
 */
export function getType(tokenOrCollection: DesignToken) {
  const path = (tokenOrCollection.path ?? []);
  const collections = [];

  path.reduce((
    last: DesignToken,
    key: string,
    i: string | number,
  ) => {
    if (key === '_') {
      return last;
    }
    const value = last[key];
    collections[i] = { key, value };
    return value;
  }, sources);

  return collections.reduceRight(($, x) => {
    const { value: { $type = undefined } = {} } = x;
    return $ ?? $type;
  }, tokenOrCollection.$type);
}
