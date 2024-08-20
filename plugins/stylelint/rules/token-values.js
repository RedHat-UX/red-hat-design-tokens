import { tokens } from '@rhds/tokens';
import { utils } from 'stylelint';
import parser, { stringify } from 'postcss-value-parser';

const ruleName = 'rhds/token-values';

const messages = utils.ruleMessages(ruleName, {
  expected: 'Expected ...'
});

const meta = {
  url: 'https://github.com/RedHat-UX/red-hat-design-tokens/tree/main/plugins/stylelint/rules/token-values.js',
};

/** @type {import('stylelint').Plugin} */
const ruleFunction = (_options, _secondaryOptions, ctx) => {
  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        /* .. */
      }
    );

    if (!validOptions) {
      return;
    }

    root.walk(node => {
      if (node.type === 'decl') {
        const parsedValue = parser(node.value);
        parsedValue.walk(ch => {
          if (ch.type === 'function' && ch.value === 'var' && ch.nodes.length > 1) {
            const [{ value: name }, , ...values] = ch.nodes ?? [];
            if (tokens.has(name)) {
              const actual = stringify(values);
              const expected = tokens.get(name).toString();
              if (expected !== actual) {
                if (ctx.fix) {
                  ch.nodes[2] = parser(expected);
                  node.value = stringify(parsedValue);
                  return;
                } else {
                  utils.report({
                    node,
                    message: `Expected ${name} to equal ${expected}`,
                    ruleName,
                    result,
                    line: node.line,
                    column: node.column + ch.sourceIndex,
                    endLine: node.endLine,
                    endColumn: node.endColumn,
                  });
                }
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
