import { copyFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DOCS_STYLES_IN = fileURLToPath(new URL('../docs/styles.css', import.meta.url));
const DOCS_STYLES_OUT = fileURLToPath(new URL('../build/styles.css', import.meta.url));

/**
 * Copy web assets to build dir
 * @type {import('style-dictionary').Named<import('style-dictionary').Action>}
 */
export const copyAssets = {
  name: 'copyAssets',
  do() {
    copyFileSync(DOCS_STYLES_IN, DOCS_STYLES_OUT);
  },
  undo() {
    rmSync(DOCS_STYLES_OUT, {
      force: true,
    });
  }
};

/**
 * Write declaration file for JS token map
 * @type {import('style-dictionary').Named<import('style-dictionary').Action>}
 */
export const writeEsMapDeclaration = {
  name: 'writeEsMapDeclaration',
  do() {
    const TOKENS_DECL_CONTENT = 'export declare const tokens: Map<`--rh-${string}`, string|number>;';
    for (const ext of ['ts', 'cts']) {
      writeFileSync(new URL(`./js/tokens.d.${ext}`, import.meta.url), TOKENS_DECL_CONTENT, 'utf8');
    }
  },
  undo() {
    for (const ext of ['ts', 'cts']) {
      rmSync(new URL(`./js/tokens.d.${ext}`, import.meta.url));
    }
  }

};
