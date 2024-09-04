import type { Action } from 'style-dictionary/types';

import { readFile, writeFile, rm } from 'node:fs/promises';

import { fileURLToPath } from 'node:url';

const rel = (path: string) => new URL(path, import.meta.url);
const PACKAGE_JSON_URL = rel('../../package.json');
const TOKENS_DECL_CONTENT = 'export declare const tokens: Map<`--rh-${string}`, string|number>;';
const TOKENS_DECL_URLS = [
  rel('../../js/tokens.d.ts'),
  rel('../../js/tokens.d.cts'),
];

/**
 * Write declaration file for JS token map
 */
export const writeEsMapDeclaration: Action = {
  name: 'writeEsMapDeclaration',
  async do() {
    for (const url of TOKENS_DECL_URLS) {
      await writeFile(url, TOKENS_DECL_CONTENT, 'utf8');
    }
  },
  async undo() {
    for (const url of TOKENS_DECL_URLS) {
      await rm(url);
    }
  },
};


