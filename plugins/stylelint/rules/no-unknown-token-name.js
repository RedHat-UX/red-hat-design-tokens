import { dirname, sep } from 'node:path';
import { tokens } from '@rhds/tokens';
import { utils } from 'stylelint';
import declarationValueIndex from 'stylelint/lib/utils/declarationValueIndex';
import parser from 'postcss-value-parser';

const ruleName = 'rhds/no-unknown-token-name';

const messages = utils.ruleMessages(ruleName, {
  expected: 'Expected ...',
});

const meta = {
  url: 'https://github.com/RedHat-UX/red-hat-design-tokens/tree/main/plugins/stylelint/rules/no-unknown-token-name.js',
};

/** @type {import('stylelint').Plugin} */
const ruleFunction = (_, opts, ctx) => {
  return (root, result) => {
    // here we assume a file structure of */rh-tagname/rh-tagname.css
    const tagName = dirname(root.source.input.file)
        .split(sep)
        .findLast(x => x.startsWith('rh-'));
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

    const migrations = new Map(Object.entries(opts?.migrations ?? {}));

    root.walk(node => {
      if (node.type === 'decl') {
        const parsedValue = parser(node.value);
        parsedValue.walk(parsed => {
          if (parsed.type === 'function' && parsed.value === 'var') {
            const [{ value }] = parsed.nodes ?? [];
            if (value.startsWith('--rh')
                && !value.startsWith(`--${tagName}`)
                && !tokens.has(value)
                || migrations.has(value)) {
              const message = `Expected ${value} to be a known token name`;
              const { nodes: [{ sourceIndex, sourceEndIndex }] } = parsed;
              const declIndex = declarationValueIndex(node);
              const index = declIndex + sourceIndex;
              const endIndex = declIndex + sourceEndIndex;
              if (ctx.fix && migrations.has(value)) {
                node.value = node.value.replace(value, migrations.get(value));
                return;
              } else {
                utils.report({ node, message, ruleName, result, index, endIndex });
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
