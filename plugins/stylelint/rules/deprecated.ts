import type { Rule } from 'stylelint';

import { tokens } from '@rhds/tokens/meta.js';

import stylelint from 'stylelint';
import parser from 'postcss-value-parser';

const ruleName = 'rhds/deprecated';

const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: '...',
});

const meta = {
  url: 'https://github.com/RedHat-UX/red-hat-design-tokens/tree/main/plugins/stylelint/rules/deprecated.ts',
  fixable: true,
};

function isVarCall(parsedNode: parser.Node): parsedNode is parser.FunctionNode {
  return parsedNode.type === 'function'
    && parsedNode.value === 'var';
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
            const [value, ...fallback] = parsedNode.nodes ?? [];
            const { value: name } = value;
            if (tokens.has(name as `--rh-${string}`)) {
              const expected = tokens.get(name as `--rh-${string}`);
              if (expected?.$extensions?.['com.redhat.ux']?.deprecated) {
                const replacement = `--rh-${expected.original.$value.replace(/{(.*)}/, '$1').replaceAll('.', '-')}`;
                const message = `${name} is deprecated, use ${replacement} instead`;
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
                    const infix = `var(${replacement}${fallback?.map(node => node.value)?.join('') ?? ''})`;
                    const suffix = node.value.slice(parsedNode.sourceEndIndex);
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