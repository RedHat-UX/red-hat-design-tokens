import type tape from 'tape';

import describe from 'tape-describe';

import { tokens } from '@rhds/tokens';

import stylelint from 'stylelint';

async function getAutofixedCSS(codeFilename: string, code: string) {
  const result = await stylelint.lint({
    code,
    codeFilename,
    fix: true,
    config: {
      rules: { 'rhds/token-values': true },
      plugins: ['./plugins/stylelint.js'],
    },
  });
  return result.code;
}

describe('token-values', (test: typeof tape) => {
  test('light-dark value', async t => {
    t.plan(2);
    const name = '--rh-color-accent-base';
    const value = tokens.get(name);
    const input = `a { color: var(${name}, light-dark( var(--rh-color-accent-base-on-light, #0066cc), var(--rh-color-accent-base-on-dark, #92c5f9) )); }`;
    const valid = await getAutofixedCSS('light-dark-valid.css', input);
    t.isEqual(valid, input, 'accepts a structurally matching light-dark fallback');

    const invalid = `a { color: var(${name}, hotpink); }`;
    const fixed = `a { color: var(${name}, ${value}); }`;
    const actual = await getAutofixedCSS('light-dark-invalid.css', invalid);
    t.isEqual(actual, fixed, 'corrects an invalid light-dark fallback');
  });

  test('simple value', async t => {
    t.plan(1);
    const xl = tokens.get('--rh-space-xl');
    const lg = tokens.get('--rh-space-lg');
    const inputcss = `a { padding: var(--rh-space-xl, ${lg}); }`;
    const expected = `a { padding: var(--rh-space-xl, ${xl}); }`;
    const actual = await getAutofixedCSS('simple.css', inputcss);
    t.isEqual(actual, expected, 'corrects simple value');
  });

  test('simple list', async t => {
    t.plan(1);
    const xl = tokens.get('--rh-space-xl');
    const lg = tokens.get('--rh-space-lg');
    const inputcss = `a { padding: var(--rh-space-xl, ${xl}) var(--rh-space-lg, ${xl}); }`;
    const expected = `a { padding: var(--rh-space-xl, ${xl}) var(--rh-space-lg, ${lg}); }`;
    const actual = await getAutofixedCSS('simple.css', inputcss);
    t.isEqual(actual, expected, 'corrects list values');
  });

  test('nested custom property value', async t => {
    t.plan(1);
    const xl = tokens.get('--rh-space-xl');
    const lg = tokens.get('--rh-space-lg');
    const inputcss = `a { padding: var(--_padding: var(--rh-space-lg, ${xl})); }`;
    const expected = `a { padding: var(--_padding: var(--rh-space-lg, ${lg})); }`;
    const actual = await getAutofixedCSS('nested.css', inputcss);
    t.isEqual(actual, expected, 'corrects nested value');
  });

  test('list with nested custom property value', async t => {
    t.plan(1);
    const xl = tokens.get('--rh-space-xl');
    const lg = tokens.get('--rh-space-lg');
    const inputcss = `a { padding: var(--_padding-inline: var(--rh-space-lg, ${xl})) var(--_padding-block: var(--rh-space-lg, ${xl})); }`;
    const expected = `a { padding: var(--_padding-inline: var(--rh-space-lg, ${lg})) var(--_padding-block: var(--rh-space-lg, ${lg})); }`;
    const actual = await getAutofixedCSS('list-nested.css', inputcss);
    t.isEqual(actual, expected);
  });
});
