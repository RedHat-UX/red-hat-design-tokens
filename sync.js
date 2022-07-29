import { readFile, writeFile } from 'node:fs/promises';

const TEMPLATE = {
  "name": "red-hat-design-tokens",
  "publisher": "Red Hat UX",
  "engines": {
    "vscode": "^0"
  },
  "license": "MIT",
  "description": "Red Hat Design System Tokens",
  "displayName": "Red Hat Design Tokens",
  "categories": [
    "Snippets"
  ],
  "contributes": {
    "snippets": [
      {
        "language": "css",
        "path": "snippets.json"
      },
      {
        "language": "scss",
        "path": "snippets.json"
      }
    ]
  },
  "bugs": {
    "url": "https://github.com/redhat-ux/red-hat-design-tokens/issues"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/redhat-ux/red-hat-design-tokens"
  },
  "homepage": "https://red-hat-design-tokens.netlify.app"
}


const PATH = new URL('editor/vscode/package.json', import.meta.url);
const { version } = JSON.parse(await readFile(new URL('package.json', import.meta.url), 'utf8'));

await writeFile(PATH, JSON.stringify({...TEMPLATE, version }, null, 2), 'utf8')
