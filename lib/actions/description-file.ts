import type { Token } from 'style-dictionary';
import type { Action } from 'style-dictionary/types';

import { readFile, writeFile, rm } from 'node:fs/promises';

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rel = (path: string) => new URL(path, import.meta.url);
const OUTPUT_JSON_URL = rel('../../json/rhds.tokens.json');
const EXT_KEY = 'com.redhat.ux';

function getFilePathGuess(collection: Token) {
  return Object.values(collection ?? {}).reduce((path, val) =>
      path || (val && typeof val !== 'object') ? path
    : (val && '$value' in val) ? val.filePath
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

export const descriptionFile: Action = {
  name: 'descriptionFile',
  async do() {
    const json = JSON.parse(await readFile(OUTPUT_JSON_URL, 'utf8') as unknown as string);
    writeDescription(json);
    await writeFile(OUTPUT_JSON_URL, JSON.stringify(json, null, 2));
  },
  async undo() {
    await rm(OUTPUT_JSON_URL);
  },
};
