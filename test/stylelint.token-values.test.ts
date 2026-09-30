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
    t.plan(7);
    const name = '--rh-color-accent-base';
    const value = tokens.get(name);
    const input = `a { color: var(${name}, light-dark( var(--rh-color-accent-base-on-light, #0066cc), var(--rh-color-accent-base-on-dark, #92c5f9) )); }`;
    const valid = await getAutofixedCSS('light-dark-valid.css', input);
    t.isEqual(valid, input, 'accepts a structurally matching light-dark fallback');

    const literalArgs = `a { color: var(${name}, light-dark(red, blue)); }`;
    const fixedLiteralArgs = await getAutofixedCSS('light-dark-literal-args.css', literalArgs);
    t.isEqual(fixedLiteralArgs, `a { color: var(${name}, ${value}); }`, 'corrects noncanonical scheme-token arguments');

    const standalone = 'a { color: light-dark(red, blue); }';
    const standaloneResult = await getAutofixedCSS('light-dark-standalone.css', standalone);
    t.isEqual(standaloneResult, standalone, 'leaves standalone light-dark() calls alone');

    const invalid = `a { color: var(${name}, hotpink); }`;
    const fixed = `a { color: var(${name}, ${value}); }`;
    const actual = await getAutofixedCSS('light-dark-invalid.css', invalid);
    t.isEqual(actual, fixed, 'corrects an invalid light-dark fallback');

    const extraLiteral = `a { color: var(${name}, light-dark(var(--rh-color-accent-base-on-light, #0066cc) hotpink, var(--rh-color-accent-base-on-dark, #92c5f9))); }`;
    const fixedExtraLiteral = await getAutofixedCSS('light-dark-extra-literal.css', extraLiteral);
    t.isEqual(fixedExtraLiteral, fixed, 'corrects an extra literal inside light-dark()');

    const missingComma = `a { color: var(${name}, light-dark(var(--rh-color-accent-base-on-light, #0066cc) var(--rh-color-accent-base-on-dark, #92c5f9))); }`;
    const fixedMissingComma = await getAutofixedCSS('light-dark-missing-comma.css', missingComma);
    t.isEqual(fixedMissingComma, fixed, 'corrects light-dark() arguments without a comma');

    const contentAfterFunction = `a { color: var(${name}, light-dark(var(--rh-color-accent-base-on-light, #0066cc), var(--rh-color-accent-base-on-dark, #92c5f9)) hotpink); }`;
    const fixedContentAfterFunction = await getAutofixedCSS('light-dark-trailing-content.css', contentAfterFunction);
    t.isEqual(fixedContentAfterFunction, fixed, 'corrects content after light-dark()');
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
