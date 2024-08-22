import {
  readFile,
  copyFile,
  mkdir,
  writeFile,
  rmdir,
  rm,
  readdir,
} from 'node:fs/promises';

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Token } from 'style-dictionary'
import type { Action } from 'style-dictionary/types';

const rel = (path: string) => new URL(path, import.meta.url);
const DOCS_STYLES_IN = fileURLToPath(rel('../docs/styles.css'));
const DOCS_STYLES_OUT = fileURLToPath(rel('../build/styles.css'));
const TYPES_IN = fileURLToPath(rel('./types.ts'));
const TYPES_OUT = fileURLToPath(rel('../js/types.ts'));
const ASSETS_IN_DIR = rel('../docs/assets/');
const ASSETS_OUT_DIR = rel('../build/assets/');
const PACKAGE_JSON_URL = rel('../package.json');
const OUTPUT_JSON_URL = rel('../json/rhds.tokens.json');
const LICENSE_URL = rel('../LICENSE');
const VSCODE_LICENSE_URL = rel('../editor/vscode/LICENSE');
const README_URL = rel('../LICENSE');
const VSCODE_README_URL = rel('../editor/vscode/README.md');
const VSIX_MANIFEST_URL = rel('../editor/vscode/package.json');
const TOKENS_DECL_CONTENT = 'export declare const tokens: Map<`--rh-${string}`, string|number>;';
const EXT_KEY = 'com.redhat.ux';
const TOKENS_DECL_URLS = [
  rel('../js/tokens.d.ts'),
  rel('../js/tokens.d.cts')
];

const { version } = JSON.parse(
  await readFile(PACKAGE_JSON_URL, 'utf-8') as unknown as string
);

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
  }
};

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
  }
};

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
  }
};

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
          { language: 'scss', path: './snippets.json' }
        ]
      },
      bugs: {
        url: 'https://github.com/redhat-ux/red-hat-design-tokens/issues'
      },
      repository: {
        type: 'git',
        url: 'https://github.com/redhat-ux/red-hat-design-tokens'
      },
    }, null, 2), 'utf8');
  },
  async undo() {
    await rm(VSIX_MANIFEST_URL);
    await rm(VSCODE_LICENSE_URL);
    await rm(VSCODE_README_URL);
  }
};

function getFilePathGuess(collection: Token) {
  return Object.values(collection).reduce((path, val) =>
      path || typeof val !== 'object' ? path
            : '$value' in val ? val.filePath
            : getFilePathGuess(val), '');
}

function getDescription(collection) {
  const {
    filePath = getFilePathGuess(collection),
    descriptionFile,
  } = collection.$extensions[EXT_KEY];
  return readFile(join(process.cwd(), dirname(filePath), descriptionFile), 'utf-8');
}

function writeDescription(parent) {
  if (EXT_KEY in (parent?.$extensions ?? {})) {
    const { descriptionFile } = parent.$extensions[EXT_KEY];
    if (descriptionFile) {
      parent.$extensions[EXT_KEY].description ??= getDescription(parent);
    }
  }
  for (const value of Object.values(parent)) {
    if (typeof value === 'object' && value) {
      writeDescription(value);
    }
  }
}

export const descriptionFile = {
  name: 'descriptionFile',
  async do() {
    const json = JSON.parse(await readFile(OUTPUT_JSON_URL, 'utf8') as unknown as string);
    writeDescription(json);
    await writeFile(OUTPUT_JSON_URL, JSON.stringify(json, null, 2));
  },
  async undo() {
    await rm(OUTPUT_JSON_URL)
  }
};
