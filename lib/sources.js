import YAML from 'yaml';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

import g from 'glob';
import deepmerge from 'deepmerge';

const glob = promisify(g);

const cwd = fileURLToPath(new URL('../tokens/', import.meta.url));

const files = await glob('**/*.y?(a)ml', { absolute: true, cwd });

const parsed = await Promise.all(files.map(async x => YAML.parse(await readFile(x, 'utf8'))));

/** merged static tokens sources files */
export const sources = deepmerge.all(parsed);

export function getType(tokenOrCollection) {
  const path = (tokenOrCollection.path ?? []);
  const collections = [];

  path.reduce((last, key, i) => {
    if (key === '_') {
      return last;
    }
    const value = last[key];
    collections[i] = { key, value };
    return value;
  }, sources);

  return collections.reduceRight(($, x) => {
    const { value: { $type } = {} } = x;
    return $ ?? $type;
  }, tokenOrCollection.$type);
}
