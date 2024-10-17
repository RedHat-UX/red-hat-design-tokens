import type { Action } from 'style-dictionary/types';

import { readFile, copyFile, mkdir, writeFile, rm } from 'node:fs/promises';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const rel = (path: string) => new URL(path, import.meta.url);
const PACKAGE_JSON_URL = rel('../../package.json');

const LICENSE_URL = rel('../../LICENSE');
const VSCODE_LICENSE_URL = rel('../../editor/vscode/LICENSE');
const README_URL = rel('../../LICENSE');
const VSCODE_README_URL = rel('../../editor/vscode/README.md');
const VSIX_MANIFEST_URL = rel('../../editor/vscode/package.json');

const { version } = JSON.parse(
  await readFile(PACKAGE_JSON_URL, 'utf-8') as unknown as string
);

/**
 * Write VSCode package manifest
 */
export const writeVSIXManifest: Action = {
  name: 'writeVSIXManifest',
  async do() {
    await mkdir(dirname(fileURLToPath(VSIX_MANIFEST_URL)), { recursive: true });
    await copyFile(LICENSE_URL, VSCODE_LICENSE_URL);
    await copyFile(README_URL, VSCODE_README_URL);
    await writeFile(VSIX_MANIFEST_URL, JSON.stringify({
      name: 'red-hat-design-tokens',
      version,
      publisher: 'Red Hat UX',
      engines: { vscode: '^1.63.0' },
      license: 'MIT',
      description: 'Red Hat Design System Tokens',
      homepage: 'https://ux.redhat.com',
      displayName: 'Red Hat Design Tokens',
      categories: ['Snippets'],
      contributes: {
        snippets: [
          { language: 'css', path: './snippets.json' },
          { language: 'scss', path: './snippets.json' },
        ],
      },
      bugs: {
        url: 'https://github.com/redhat-ux/red-hat-design-tokens/issues',
      },
      repository: {
        type: 'git',
        url: 'https://github.com/redhat-ux/red-hat-design-tokens',
      },
    }, null, 2), 'utf8');
  },
  async undo() {
    await rm(VSIX_MANIFEST_URL);
    await rm(VSCODE_LICENSE_URL);
    await rm(VSCODE_README_URL);
  },
};

