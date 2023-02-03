import { readFileSync, copyFileSync, mkdirSync, rmSync, writeFileSync, rmdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** @typedef {import('style-dictionary').Named<import('style-dictionary').Action>} Action */

const rel = path => new URL(path, import.meta.url);
const DOCS_STYLES_IN = fileURLToPath(rel('../docs/styles.css'));
const DOCS_STYLES_OUT = fileURLToPath(rel('../build/styles.css'));
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

const { version } = JSON.parse(readFileSync(PACKAGE_JSON_URL, 'utf8'));

/**
 * Copy web assets to build dir
 * @type {Action}
 */
export const copyAssets = {
  name: 'copyAssets',
  do() {
    copyFileSync(DOCS_STYLES_IN, DOCS_STYLES_OUT);
    mkdirSync(ASSETS_IN_DIR, { recursive: true });
    mkdirSync(ASSETS_OUT_DIR, { recursive: true });
    for (const asset of readdirSync(ASSETS_IN_DIR)) {
      copyFileSync(
        new URL(`./${asset}`, ASSETS_IN_DIR.href),
        new URL(`./${asset}`, ASSETS_OUT_DIR.href),
      );
    }
  },
  undo() {
    rmdirSync(ASSETS_OUT_DIR, { force: true });
    rmSync(DOCS_STYLES_OUT, { force: true });
  }
};

/**
 * Write declaration file for JS token map
 * @type {Action}
 */
export const writeEsMapDeclaration = {
  name: 'writeEsMapDeclaration',
  do() {
    for (const url of TOKENS_DECL_URLS) {
      writeFileSync(url, TOKENS_DECL_CONTENT, 'utf8');
    }
  },
  undo() {
    for (const url of TOKENS_DECL_URLS) {
      rmSync(url);
    }
  }
};

/**
 * Write VSCode package manifest
 * @type {Action}
 */
export const writeVSIXManifest = {
  name: 'writeVSIXManifest',
  do() {
    mkdirSync(dirname(fileURLToPath(VSIX_MANIFEST_URL)), { recursive: true });
    copyFileSync(LICENSE_URL, VSCODE_LICENSE_URL);
    copyFileSync(README_URL, VSCODE_README_URL);
    writeFileSync(VSIX_MANIFEST_URL, JSON.stringify({
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
  undo() {
    rmSync(VSIX_MANIFEST_URL);
    rmSync(VSCODE_LICENSE_URL);
    rmSync(VSCODE_README_URL);
  }
};

function getFilePathGuess(collection) {
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
  return readFileSync(join(process.cwd(), dirname(filePath), descriptionFile), 'utf-8');
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
  do() {
    const json = JSON.parse(readFileSync(OUTPUT_JSON_URL, 'utf8'));
    writeDescription(json);
    writeFileSync(OUTPUT_JSON_URL, JSON.stringify(json, null, 2));
  }
};
