import type tape from 'tape';

import describe from 'tape-describe';

import stylelint from 'stylelint';

async function runRule(codeFilename: string, code: string) {
  return stylelint.lint({
    code,
    codeFilename,
    config: {
      rules: { 'rhds/no-unknown-token-name': true },
      plugins: ['./plugins/stylelint.js'],
    },
  });
}

async function getAutofixedCSS(codeFilename: string, code: string) {
  const result = await stylelint.lint({
    code,
    codeFilename,
    fix: true,
    config: {
      rules: { 'rhds/no-unknown-token-name': [true, { migrations: {
        '--rh-color-black-900': '--rh-color-grey-900',
        '--rh-color-black-100': '--rh-color-grey-100',
      } }] },
      plugins: ['./plugins/stylelint.js'],
    },
  });
  return result.code;
}

describe('no-unknown-token-name', (test: typeof tape) => {
  test('simple list with typo in one name', async t => {
    t.plan(3);
    const { errored, results: [{ warnings: [warning, ...rest] }] } =
    await runRule('simple-list.css', `
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
      fix: undefined,
      rule: 'rhds/no-unknown-token-name',
      severity: 'error',
      text: 'Expected --rh-space-xx to be a known token name',
      url: undefined,
    }, 'provides detail');
  });

  test('simple list with typo in two names', async t => {
    t.plan(5);
    const { errored, results: [{ warnings: [warning1, warning2, ...rest] }] } =
    await runRule('typo-list.css', `
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
      fix: undefined,
      rule: 'rhds/no-unknown-token-name',
      severity: 'error',
      text: 'Expected --rh-leng-xl to be a known token name',
      url: undefined,
    }, 'provides detail for first error');

    t.deepEqual(warning2, {
      line: 3,
      column: 34,
      endLine: 3,
      endColumn: 47,
      fix: undefined,
      rule: 'rhds/no-unknown-token-name',
      severity: 'error',
      text: 'Expected --rh-space-xx to be a known token name',
      url: undefined,
    }, 'provides detail for second error');
  });

  test('nested custom property value', async t => {
    t.plan(3);
    const { errored, results: [{ warnings: [warning, ...rest] }] } =
    await runRule('nested.css', `
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
      fix: undefined,
      rule: 'rhds/no-unknown-token-name',
      severity: 'error',
      text: 'Expected --rh-space-xx to be a known token name',
      url: undefined,
    }, 'provides detail');
  });

  test('list with nested custom property value', async t => {
    t.plan(5);
    const { errored, results: [{ warnings: [warning1, warning2, ...rest] }] } =
    await runRule('list-nested.css', `
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
      fix: undefined,
      rule: 'rhds/no-unknown-token-name',
      severity: 'error',
      text: 'Expected --rh-space-ll to be a known token name',
      url: undefined,
    }, 'provides detail for first error');

    t.deepEqual(warning2, {
      line: 3,
      column: 82,
      endLine: 3,
      endColumn: 96,
      fix: undefined,
      rule: 'rhds/no-unknown-token-name',
      severity: 'error',
      text: 'Expected --rh-length-ll to be a known token name',
      url: undefined,
    }, 'provides detail for second error');
  });

  test('migrating names', async t => {
    t.plan(3);
    const inputval = `a { color: var(--rh-color-black-900); }`;
    const expecval = `a { color: var(--rh-color-grey-900); }`;
    t.isEqual(await getAutofixedCSS('migrating-simple.css', inputval), expecval, 'simple value');

    const inputnest = `a { color: var(--_color: var(--rh-color-black-900)); }`;
    const expecnest = `a { color: var(--_color: var(--rh-color-grey-900)); }`;
    t.isEqual(await getAutofixedCSS('migrating-nested.css', inputnest), expecnest, 'nested custom property value');

    const inputlistnest = `a { --colors: var(--_color, var(--rh-color-black-900)) var(--_color-bg: var(--rh-color-black-100)); }`;
    const expeclistnest = `a { --colors: var(--_color, var(--rh-color-grey-900)) var(--_color-bg: var(--rh-color-grey-100)); }`;
    t.isEqual(await getAutofixedCSS('migrating-list-nested.css', inputlistnest), expeclistnest, 'list with nested custom property value');
  });
});
