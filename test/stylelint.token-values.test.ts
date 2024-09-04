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
