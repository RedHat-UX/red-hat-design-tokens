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

function isVarCall(parsedNode: parser.Node): parsedNode is parser.FunctionNode {
  return parsedNode.type === 'function'
    && parsedNode.value === 'var'
    && parsedNode.nodes.length > 1;
}

const ruleFunction: Rule = () => {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName);

    if (!validOptions) {
      return;
    }

    root.walk(node => {
      if (node.type === 'decl') {
        const parsedValue = parser(node.value);
        parsedValue.walk(parsedNode => {
          if (isVarCall(parsedNode)) {
            const [value, , ...values] = parsedNode.nodes ?? [];
            const { value: name } = value;
            if (tokens.has(name)) {
              const actual = parser.stringify(values);
              const expected = tokens.get(name);
              if (expected === null && actual == null) {
                return;
              } else if ((expected as string)?.toString() !== actual) {
                const message =
                    expected === null ? `Expected ${name} to not have a fallback value`
                  : `Expected ${name} to equal ${expected}`;
                stylelint.utils.report({
                  node,
                  message,
                  ruleName,
                  result,
                  word: name,
                  index: value.sourceIndex,
                  endIndex: value.sourceEndIndex,
                  fix() {
                    const prefix = node.value.slice(0, parsedNode.sourceIndex);
                    let infix = `var(${name}, ${expected})`;
                    const suffix = node.value.slice(parsedNode.sourceEndIndex);
                    if (expected === null) {
                      infix = `var(${name})`;
                    }
                    node.value = `${prefix}${infix}${suffix}`;
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
