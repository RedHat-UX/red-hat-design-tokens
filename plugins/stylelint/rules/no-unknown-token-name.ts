import type { Rule } from 'stylelint';

import { dirname, sep } from 'node:path';
import { tokens } from '@rhds/tokens';

import stylelint from 'stylelint';
import parser from 'postcss-value-parser';

const ruleName = 'rhds/no-unknown-token-name';

const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: 'Expected ...',
});

const meta = {
  url: 'https://github.com/RedHat-UX/red-hat-design-tokens/tree/main/plugins/stylelint/rules/no-unknown-token-name.ts',
  fixable: true,
};

const ruleFunction: Rule = (_, opts) => {
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
            const [child] = parsed.nodes ?? [];
            const { value } = child;
            if (value.startsWith('--rh')
                && !value.startsWith(`--${tagName}`)
                && !tokens.has(value as `--rh-${string}`)
                || migrations.has(value)) {
              const message = `Expected ${value} to be a known token name`;
              stylelint.utils.report({
                node,
                message,
                ruleName,
                result,
                word: value,
                index: child.sourceIndex,
                endIndex: child.sourceEndIndex,
                fix() {
                  if (migrations.has(value)) {
                    node.value = node.value.replace(value, migrations.get(value) as `--rh-${string}`);
                  }
                },
              });
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
