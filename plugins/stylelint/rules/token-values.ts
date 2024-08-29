import type { Rule } from 'stylelint';

import { tokens } from '@rhds/tokens';

import stylelint from 'stylelint';
import parser, { stringify } from 'postcss-value-parser';

const ruleName = 'rhds/token-values';

const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: 'Expected ...',
});

const meta = {
  url: 'https://github.com/RedHat-UX/red-hat-design-tokens/tree/main/plugins/stylelint/rules/token-values.js',
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
            const [{ value: name }, , ...values] = ch.nodes ?? [];
            if (tokens.has(name as `--rh-${string}`)) {
              const actual = stringify(values);
              const expected = tokens.get(name as `--rh-${string}`).toString();
              if (expected !== actual) {
                stylelint.utils.report({
                  node,
                  message: `Expected ${name} to equal ${expected}`,
                  ruleName,
                  result,
                  fix() {
                    ch.nodes = ch.nodes.toSpliced(2, 0, ...parser(expected).nodes);
                    node.value = stringify(parsedValue.nodes);
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
