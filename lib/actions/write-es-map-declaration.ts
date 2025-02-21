import type { Action } from 'style-dictionary/types';

import { writeFile, rm } from 'node:fs/promises';

const rel = (path: string) => new URL(path, import.meta.url);

const files = new Map([
  [
    rel('../../js/tokens.d.ts'),
    'export declare const tokens: Map<`--rh-${string}`, string|number>;',
  ],
  [
    rel('../../js/meta.d.ts'),
    `interface DesignToken {
    value?: any;
    $value?: any;
    type?: string;
    $type?: string;
    $description?: string;
    name?: string;
    comment?: string;
    themeable?: boolean;
    attributes?: Record<string, unknown>;
    [key: string]: any;
}

export declare const tokens: Map<\`--rh-\${string}\`, DesignToken>;
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


