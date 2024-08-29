import type { Action } from 'style-dictionary/types';

import { copyFile, rm } from 'node:fs/promises';

import { fileURLToPath } from 'node:url';

const rel = (path: string) => new URL(path, import.meta.url);
const TYPES_IN = fileURLToPath(rel('../types.ts'));
const TYPES_OUT = fileURLToPath(rel('../../js/types.ts'));

/**
 * Copy base TS types
 */
export const copyTypes: Action = {
  name: 'copyTypes',
  async do() {
    await copyFile(TYPES_IN, TYPES_OUT);
  },
  async undo() {
    await rm(TYPES_OUT, { force: true });
  },
};

