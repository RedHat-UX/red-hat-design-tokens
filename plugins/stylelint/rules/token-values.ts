import type { Rule } from 'stylelint';

import { tokens } from '@rhds/tokens';

import stylelint from 'stylelint';
import parser from 'postcss-value-parser';

const ruleName = 'rhds/token-values';

const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: 'Expected ...',
});

const meta = {
  url: 'https://github.com/RedHat-UX/red-hat-design-tokens/tree/main/plugins/stylelint/rules/token-values.ts',
  fixable: true,
};

const ruleFunction: Rule = () => {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName);

    if (!validOptions) {
      return;
    }

    root.walk(node => {
      if (node.type === 'decl') {
        const parsedValue = parser(node.value);
        parsedValue.walk(ch => {
          if (ch.type === 'function' && ch.value === 'var' && ch.nodes.length > 1) {
            const [value, , ...values] = ch.nodes ?? [];
            const { value: name } = value;
            if (tokens.has(name as `--rh-${string}`)) {
              const actual = parser.stringify(values);
              const expected = tokens.get(name as `--rh-${string}`)?.toString();
              if (expected !== actual) {
                stylelint.utils.report({
                  node,
                  message: `Expected ${name} to equal ${expected}`,
                  ruleName,
                  result,
                  word: name,
                  index: value.sourceIndex,
                  endIndex: value.sourceEndIndex,
                  fix() {
                    ch.nodes = ch.nodes.toSpliced(2, 0, ...parser(expected).nodes);
                    node.value = parser.stringify(parsedValue.nodes);
                  },
                });
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
