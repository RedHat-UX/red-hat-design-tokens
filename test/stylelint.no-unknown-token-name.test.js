/* eslint-disable no-console */
import test from 'tape';

import stylelint from 'stylelint';

async function runRule(code) {
  return stylelint.lint({
    code,
    fix: true,
    config: {
      rules: { 'rhds/no-unknown-token-name': true },
      plugins: ['./plugins/stylelint.cjs'],
    }
  });
}

test('simple list with typo in one name', async t => {
  t.plan(3);
  const { errored, results: [{ warnings: [warning, ...rest] }] } =
    await runRule(`
a {
  padding: var(--rh-space-xl) var(--rh-space-xx);
}`);

  t.true(errored, 'errors');
  t.equal(rest.length, 0, 'gives a single warning');

  t.deepEqual(warning, {
    line: 3,
    column: 35,
    endLine: 3,
    endColumn: 48,
    rule: 'rhds/no-unknown-token-name',
    severity: 'error',
    text: 'Expected --rh-space-xx to be a known token name',
  }, 'provides detail');
});

test('simple list with typo in two names', async t => {
  t.plan(5);
  const { errored, results: [{ warnings: [warning1, warning2, ...rest] }] } =
    await runRule(`
a {
  padding: var(--rh-leng-xl) var(--rh-space-xx);
}`);
  t.true(errored, 'errors');
  t.equal(rest.length, 0, 'gives only two warnings');
  t.notDeepEqual(warning1, warning2, 'provides separate warnings');

  t.deepEqual(warning1, {
    line: 3,
    column: 16,
    endLine: 3,
    endColumn: 28,
    rule: 'rhds/no-unknown-token-name',
    severity: 'error',
    text: 'Expected --rh-leng-xl to be a known token name',
  }, 'provides detail for first error');

  t.deepEqual(warning2, {
    line: 3,
    column: 34,
    endLine: 3,
    endColumn: 47,
    rule: 'rhds/no-unknown-token-name',
    severity: 'error',
    text: 'Expected --rh-space-xx to be a known token name',
  }, 'provides detail for second error');
});

test('nested custom property value', async t => {
  t.plan(3);
  const { errored, results: [{ warnings: [warning, ...rest] }] } =
    await runRule(`
a {
  padding: var(--_padding: var(--rh-space-xx));
}`);

  t.true(errored, 'errors');
  t.equal(rest.length, 0, 'gives a single warning');

  t.deepEqual(warning, {
    line: 3,
    column: 32,
    endLine: 3,
    endColumn: 45,
    rule: 'rhds/no-unknown-token-name',
    severity: 'error',
    text: 'Expected --rh-space-xx to be a known token name',
  }, 'provides detail');
});

test('list with nested custom property value', async t => {
  t.plan(5);
  const { errored, results: [{ warnings: [warning1, warning2, ...rest] }] } =
    await runRule(`
a {
   padding: var(--_padding-inline: var(--rh-space-ll)) var(--_padding-block: var(--rh-length-ll));
}`);

  t.true(errored, 'errors');
  t.equal(rest.length, 0, 'gives only two warnings');
  t.notDeepEqual(warning1, warning2, 'provides separate warnings');

  t.deepEqual(warning1, {
    line: 3,
    column: 40,
    endLine: 3,
    endColumn: 53,
    rule: 'rhds/no-unknown-token-name',
    severity: 'error',
    text: 'Expected --rh-space-ll to be a known token name',
  }, 'provides detail for first error');

  t.deepEqual(warning2, {
    line: 3,
    column: 82,
    endLine: 3,
    endColumn: 96,
    rule: 'rhds/no-unknown-token-name',
    severity: 'error',
    text: 'Expected --rh-length-ll to be a known token name',
  }, 'provides detail for second error');
});
