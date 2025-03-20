import type { Action } from 'style-dictionary/types';

import { $ } from 'execa';

import { rm } from 'node:fs/promises';

const rel = (path: string) => new URL(path, import.meta.url);

const files = [
  rel('../../js/tokens.d.ts'),
  rel('../../js/meta.d.ts'),
  rel('../../plugins/stylelint.d.cts'),
];

/**
 * Write declaration file for JS token map
 */
export const compile: Action = {
  name: 'compile',
  async do() {
    await $`tsc -p tsconfig.output.json`;
  },
  async undo() {
    for (const url of files) {
      await rm(url);
    }
  },
};
