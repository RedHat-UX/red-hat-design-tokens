import type { Action } from 'style-dictionary/types';

import { writeFile, rm } from 'node:fs/promises';

const rel = (path: string) => new URL(path, import.meta.url);

const files = new Map([
  [
    rel('../../js/tokens.d.ts'),
    /* ts */`\
import { ValuesMap } from './types.js';
export type * from './types.js';
export declare const tokens: ValuesMap;
`,
  ],
  [
    rel('../../js/meta.d.ts'),
    /* ts */`\
import { ValuesMap } from './types.js';
export type * from './types.js';
export declare const tokens: DesignTokensMap;
`,
  ],
]);

/**
 * Write declaration file for JS token map
 */
export const writeEsMapDeclaration: Action = {
  name: 'writeEsMapDeclaration',
  async do() {
    for (const [url, content] of files) {
      await writeFile(url, content, 'utf8');
    }
  },
  async undo() {
    for (const [url] of files) {
      await rm(url);
    }
  },
};
