import test from 'tape';

import { tokens } from '@rhds/tokens';

import stylelint from 'stylelint';

async function getAutofixedCSS(code) {
  const { output } = await stylelint.lint({
    code,
    fix: true,
    config: {
      rules: { 'rhds/token-values': true },
      plugins: ['./plugins/stylelint.cjs'],
    }
  });
  return output;
}

test('simple list', async t => {
  t.plan(1);
  const xl = tokens.get('--rh-space-xl');
  const lg = tokens.get('--rh-space-lg');
  const inputcss = `a { padding: var(--rh-space-xl, ${xl}) var(--rh-space-lg, ${xl}); }`;
  const expected = `a { padding: var(--rh-space-xl, ${xl}) var(--rh-space-lg, ${lg}); }`;
  const actual = await getAutofixedCSS(inputcss);
  t.isEqual(actual, expected);
});

test('nested custom property value', async t => {
  t.plan(1);
  const xl = tokens.get('--rh-space-xl');
  const lg = tokens.get('--rh-space-lg');
  const inputcss = `a { padding: var(--_padding: var(--rh-space-lg, ${xl})); }`;
  const expected = `a { padding: var(--_padding: var(--rh-space-lg, ${lg})); }`;
  const actual = await getAutofixedCSS(inputcss);
  t.isEqual(actual, expected);
});

test('list with nested custom property value', async t => {
  t.plan(1);
  const xl = tokens.get('--rh-space-xl');
  const lg = tokens.get('--rh-space-lg');
  const inputcss = `a { padding: var(--_padding-inline: var(--rh-space-lg, ${xl})) var(--_padding-block: var(--rh-space-lg, ${xl})); }`;
  const expected = `a { padding: var(--_padding-inline: var(--rh-space-lg, ${lg})) var(--_padding-block: var(--rh-space-lg, ${lg})); }`;
  const actual = await getAutofixedCSS(inputcss);
  t.isEqual(actual, expected);
});
