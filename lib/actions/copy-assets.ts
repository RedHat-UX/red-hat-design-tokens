import type { Action } from 'style-dictionary/types';

import { copyFile, mkdir, rmdir, rm, readdir } from 'node:fs/promises';

import { fileURLToPath } from 'node:url';

const rel = (path: string) => new URL(path, import.meta.url);
const DOCS_STYLES_IN = fileURLToPath(rel('../../docs/styles.css'));
const DOCS_STYLES_OUT = fileURLToPath(rel('../../build/styles.css'));
const ASSETS_IN_DIR = rel('../../docs/assets/');
const ASSETS_OUT_DIR = rel('../../build/assets/');

/**
 * Copy web assets to build dir
 */
export const copyAssets: Action = {
  name: 'copy-assets',
  async do() {
    await copyFile(DOCS_STYLES_IN, DOCS_STYLES_OUT);
    await mkdir(ASSETS_IN_DIR, { recursive: true });
    await mkdir(ASSETS_OUT_DIR, { recursive: true });
    for (const asset of await readdir(ASSETS_IN_DIR)) {
      await copyFile(
        new URL(`./${asset}`, ASSETS_IN_DIR.href),
        new URL(`./${asset}`, ASSETS_OUT_DIR.href),
      );
    }
  },
  async undo() {
    await rmdir(ASSETS_OUT_DIR, { recursive: true });
    await rm(DOCS_STYLES_OUT, { force: true });
  },
};

