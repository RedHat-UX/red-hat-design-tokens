import type { Dictionary, Format } from 'style-dictionary/types';

import { fileHeader } from 'style-dictionary/utils';

const makeTokensRecord = (dictionary: Dictionary) =>
  Object.fromEntries(dictionary.allTokens.map(x => [`--${x.name}`, x.$value]));

const makeMetaRecord = (dictionary: Dictionary) =>
  Object.fromEntries(dictionary.allTokens.map(x => [`--${x.name}`, x]));

const TYPE_EXPORT = /* typescript */`
import type { TokenName, DesignToken } from './tokens.js';
export type * from './tokens.js';
`;

/**
 * JavaScript token map
 * @example ```js
 * import { tokens } from '@rhds/tokens';
 *
 * const fontfamilyCssString = tokens.get('--rh-font-family-body-text');
 * // e.g. 'RedHatText, "Red Hat Text", sans-serif';
 * ```
 */
export const mapTs: Format = {
  name: 'typescript/map',
  async format({ file, dictionary }) {
    const stringTokens = dictionary.allTokens.filter(x => typeof x.$value === 'string');
    const numberTokens = dictionary.allTokens.filter(x => typeof x.$value === 'number');
    const tokenNameUnion = dictionary.allTokens.map(x => `'--${x.name}'`).join(' | ');
    return [
      await fileHeader({ file }),
      /* typescript */`\
export type TokenName = ${tokenNameUnion};

export type TokenValue = string | number;

export interface Color {
  isLight: boolean;
  hex: string;
  rgb: { r: number; g: number; b: number; a: number; };
  hsl: { h: number; s: number; l: number; a: number; };
  hsv: { h: number; s: number; v: number; a: number; };
}

export interface DesignToken<V = any> {
  value?: V;
  $value?: V;
  type?: string;
  $type?: string;
  $description?: string;
  name?: string;
  comment?: string;
  themeable?: boolean;
  attributes?: Record<string, unknown>;
  isSource?: boolean;
  original?: Partial<DesignToken>;
  [key: string]: any;
}

class TokenMap {
  #map: Map<TokenName, TokenValue>;
  get size(): number { return this.#map.size; }
  [Symbol.iterator]() { return this.#map[Symbol.iterator](); }
  constructor(entries: Record<TokenName, TokenValue>) { this.#map = new Map(Object.entries(entries)) as Map<TokenName, TokenValue>; }
  get(key: ${stringTokens.map(x => `'--${x.name}'`).join(' | ')}): string;
  get(key: ${numberTokens.map(x => `'--${x.name}'`).join(' | ')}): number;
  get(key: TokenName): TokenValue;
  get(key: string): undefined;
  get(key: TokenName): TokenValue { return this.#map.get(key as TokenName); }
  has(key: TokenName): true;
  has(key: string): false;
  has(key: string): boolean { return this.#map.has(key as TokenName); }
  keys() { return this.#map.keys(); }
  values() { return this.#map.values(); }
  entries() { return this.#map.entries(); }
  forEach(fn: (value: TokenValue, key: TokenName, map: TokenMap) => void, thisArg?: any): void {
    this.#map.forEach((v, k) => { fn.call(thisArg, v, k, this); });
  }
}

export const tokens = new TokenMap(${JSON.stringify(makeTokensRecord(dictionary), null, 2)} as const);`,
    ].join('\n');
  },
};

/**
 * JavaScript token map
 * @example Importing token objects in JavaScript modules
 *          ```js
 *          import { tokens } from '@rhds/tokens/meta.js';
 *
 *          const family = tokens.get('--rh-font-family-body-text');
 *          console.log(family.$description);
 *          // 'The font family used for body text'
 * ```
 */
export const metaMapTs: Format = {
  name: 'typescript/meta-map',
  async format({ file, dictionary }) {
    const stringTokens = dictionary.allTokens.filter(x => typeof x.$value === 'string');
    const numberTokens = dictionary.allTokens.filter(x => typeof x.$value === 'number');
    return [
      await fileHeader({ file }),
      TYPE_EXPORT,
      /* typescript */`\
class TokenMetaMap {
  #map: Map<TokenName, DesignToken>;
  get size(): number { return this.#map.size; }
  [Symbol.iterator]() { return this.#map[Symbol.iterator](); }
  constructor(entries: Record<TokenName, DesignToken>) { this.#map = new Map(Object.entries(entries)) as Map<TokenName, DesignToken>; }
  get(key: ${stringTokens.map(x => `'--${x.name}'`).join(' | ')}): DesignToken<string>;
  get(key: ${numberTokens.map(x => `'--${x.name}'`).join(' | ')}): DesignToken<number>;
  get(key: TokenName): DesignToken;
  get(key: string): null;
  get(key: TokenName): DesignToken { return this.#map.get(key); }
  has(key: TokenName): true;
  has(key: string): false;
  has(key: string): boolean { return this.#map.has(key as TokenName); }
  keys() { return this.#map.keys(); }
  values() { return this.#map.values(); }
  entries() { return this.#map.entries(); }
  forEach(fn: (value: DesignToken, key: TokenName, map: TokenMetaMap) => void, thisArg?: any): void {
    this.#map.forEach((v, k) => { fn.call(thisArg, v, k, this); });
  }
}

export const tokens = new TokenMetaMap(${JSON.stringify(makeMetaRecord(dictionary), null, 2)});`,
    ].join('\n');
  },
};


/**
 * CommonJS token map
 * @example ```js
 * const { tokens } = require('@rhds/tokens');
 *
 * const fontfamilyCssString = tokens.get('--rh-font-family-body-text');
 * // e.g. 'RedHatText, "Red Hat Text", sans-serif';
 * ```
 */
export const mapCjs: Format = {
  name: 'javascript/map-cjs',
  format: async (...args) =>
    (await mapTs
        .format(...args) as string)
        .replace('export const tokens', 'exports.tokens'),
};

/**
 * CommonJS token map
 * @example Importing token objects in CommonJS modules
 *          ```js
 *          import { tokens } from '@rhds/tokens/meta.js';
 *
 *          const family = tokens.get('--rh-font-family-body-text');
 *          console.log(family.$description);
 *          // 'The font family used for body text'
 *          ```
 */
export const metaMapCjs: Format = {
  name: 'javascript/meta-map-cjs',
  format: async (...args) =>
    (await metaMapTs
        .format(...args) as string)
        .replace(TYPE_EXPORT, '')
        .replace('export const tokens', 'exports.tokens'),
};
