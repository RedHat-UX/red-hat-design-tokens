/**
 * Smoke tests for CommonJS modules
 *
 * These tests verify that .cjs files are valid JavaScript and can be loaded
 * by Node.js without type stripping enabled. This ensures compatibility with
 * tools like @jspm/generator that don't support TypeScript syntax in .cjs files.
 *
 * @see https://github.com/redhat-ux/red-hat-design-tokens/issues/176
 */

const assert = require('node:assert');
const { test } = require('node:test');

test('js/tokens.cjs loads and parses correctly', async (t) => {
  const { tokens } = require('../js/tokens.cjs');

  await t.test('exports a tokens object', () => {
    assert.ok(tokens, 'tokens should be defined');
  });

  await t.test('tokens has expected Map-like interface', () => {
    assert.strictEqual(typeof tokens.get, 'function', 'tokens.get should be a function');
    assert.strictEqual(typeof tokens.has, 'function', 'tokens.has should be a function');
    assert.strictEqual(typeof tokens.keys, 'function', 'tokens.keys should be a function');
    assert.strictEqual(typeof tokens.values, 'function', 'tokens.values should be a function');
    assert.strictEqual(typeof tokens.entries, 'function', 'tokens.entries should be a function');
    assert.strictEqual(typeof tokens.forEach, 'function', 'tokens.forEach should be a function');
    assert.strictEqual(typeof tokens.size, 'number', 'tokens.size should be a number');
  });

  await t.test('tokens contains expected data', () => {
    assert.ok(tokens.size > 0, 'tokens should have entries');
    assert.ok(tokens.has('--rh-color-brand-red'), 'tokens should have --rh-color-brand-red');
    assert.strictEqual(typeof tokens.get('--rh-color-brand-red'), 'string', 'token value should be a string');
  });

  await t.test('tokens is iterable', () => {
    let count = 0;
    for (const [key, value] of tokens) {
      assert.ok(key.startsWith('--rh-'), `key should start with --rh-: ${key}`);
      assert.ok(value !== undefined, 'value should be defined');
      count++;
      if (count >= 3) break;
    }
    assert.ok(count > 0, 'should be able to iterate');
  });
});

test('js/meta.cjs loads and parses correctly', async (t) => {
  const { tokens } = require('../js/meta.cjs');

  await t.test('exports a tokens object', () => {
    assert.ok(tokens, 'tokens should be defined');
  });

  await t.test('tokens has expected Map-like interface', () => {
    assert.strictEqual(typeof tokens.get, 'function', 'tokens.get should be a function');
    assert.strictEqual(typeof tokens.has, 'function', 'tokens.has should be a function');
    assert.strictEqual(typeof tokens.size, 'number', 'tokens.size should be a number');
  });

  await t.test('tokens contains design token metadata', () => {
    const token = tokens.get('--rh-color-brand-red');
    assert.ok(token, 'should have --rh-color-brand-red token');
    assert.ok('$value' in token || 'value' in token, 'token should have value or $value');
    assert.ok('name' in token, 'token should have name');
  });
});
