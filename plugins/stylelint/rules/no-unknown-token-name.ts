import type { Rule } from 'stylelint';
import type { Declaration } from 'postcss';

import { dirname, sep } from 'node:path';
import { tokens } from '@rhds/tokens';

import stylelint from 'stylelint';
import parser from 'postcss-value-parser';

const ruleName = 'rhds/no-unknown-token-name';

const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: 'Expected ...',
});

const meta = {
  url: 'https://github.com/RedHat-UX/red-hat-design-tokens/tree/main/plugins/stylelint/rules/no-unknown-token-name.js',
};

const isObject = (x: unknown): x is object => typeof x === 'object' && x !== null;

/**
 * Get the index of a declaration's value
 * copied from stylelint/lib/utils/declarationValueIndex.mjs
 * @param  decl
 */
function declarationValueIndex(decl: Declaration): number {
  const { raws } = decl;
  const prop = raws.prop as object;

  return [
    isObject(prop) && 'prefix' in prop && prop.prefix,
    (isObject(prop) && 'raw' in prop && prop.raw) || decl.prop,
    isObject(prop) && 'suffix' in prop && prop.suffix,
    raws.between || ':',
    raws.value && 'prefix' in raws.value && raws.value.prefix,
  ].reduce<number>((count: number, str) => {
    if (typeof str === 'string') {
      return count + str.length;
    }

    return count;
  }, 0);
}

const ruleFunction: Rule = (_, opts, ctx) => {
  return (root, result) => {
    // here we assume a file structure of */rh-tagname/rh-tagname.css
    const tagName = dirname(root.source.input.file)
        .split(sep)
        .findLast(x => x.startsWith('rh-'));
    const validOptions = stylelint.utils.validateOptions(result, ruleName);

    if (!validOptions) {
      return;
    }

    const migrations = new Map(Object.entries(opts?.migrations ?? {}));

    root.walk(node => {
      if (node.type === 'decl') {
        const parsedValue = parser(node.value);
        parsedValue.walk(parsed => {
          if (parsed.type === 'function' && parsed.value === 'var') {
            const [{ value }] = parsed.nodes ?? [];
            if (value.startsWith('--rh')
                && !value.startsWith(`--${tagName}`)
                && !tokens.has(value as `--rh-${string}`)
                || migrations.has(value)) {
              const message = `Expected ${value} to be a known token name`;
              const { nodes: [{ sourceIndex, sourceEndIndex }] } = parsed;
              const declIndex = declarationValueIndex(node);
              const index = declIndex + sourceIndex;
              const endIndex = declIndex + sourceEndIndex;
              if (ctx.fix && migrations.has(value)) {
                node.value = node.value.replace(value, migrations.get(value) as `--rh-${string}`);
                return;
              } else {
                stylelint.utils.report({ node, message, ruleName, result, index, endIndex });
              }
            }
          }
        });
      }
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default ruleFunction;
