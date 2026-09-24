import type { Rule } from 'stylelint';

import { tokens, type TokenName } from '@rhds/tokens';

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

/**
 * Extract the token name and literal fallback from each `var()` branch of a
 * `light-dark()` value. Returning structured parts lets the rule ignore harmless
 * whitespace differences while still requiring both branches to be canonical.
 */
function extractLightDarkParts(parsed: parser.ParsedValue) {
  const lightDark = parsed.nodes?.find(node =>
    node.type === 'function' && node.value === 'light-dark');
  if (!lightDark || lightDark.type !== 'function') {
    return null;
  }

  const varNodes = lightDark.nodes.filter((node): node is parser.FunctionNode =>
    node.type === 'function' && node.value === 'var');
  if (varNodes.length !== 2) {
    return null;
  }

  return varNodes.map(variable => {
    const [nameNode, , ...fallbackNodes] = variable.nodes;
    return {
      name: nameNode.value,
      fallback: parser.stringify(fallbackNodes),
    };
  });
}

/**
 * Compare `light-dark()` fallbacks structurally. A null result means the token's
 * expected value is not in the supported two-branch shape and should fall back
 * to the rule's existing string comparison.
 */
function lightDarkMatches(actual: string, expected: string) {
  const expectedParts = extractLightDarkParts(parser(expected));
  if (!expectedParts) {
    return null;
  }

  const actualParts = extractLightDarkParts(parser(actual));
  if (!actualParts) {
    return false;
  }

  return expectedParts.every((expectedPart, index) =>
    actualParts[index]?.name === expectedPart.name
      && actualParts[index]?.fallback === expectedPart.fallback);
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
              const expected = tokens.get(name as TokenName);
              // Theme-aware tokens contain nested `var()` calls inside
              // `light-dark()`. Comparing their parsed branches avoids rewriting
              // a valid fallback solely because its whitespace differs.
              if (typeof expected === 'string' && expected.startsWith('light-dark(')) {
                const match = lightDarkMatches(actual, expected);
                if (match === true) {
                  return;
                } else if (match === false) {
                  // Replace the complete outer fallback so both theme branches,
                  // including their literal fallbacks, are restored together.
                  stylelint.utils.report({
                    node,
                    message: `Expected ${name} fallback to be ${expected}`,
                    ruleName,
                    result,
                    word: name,
                    index: value.sourceIndex,
                    endIndex: value.sourceEndIndex,
                    fix() {
                      const prefix = node.value.slice(0, parsedNode.sourceIndex);
                      const infix = `var(${name}, ${expected})`;
                      const suffix = node.value.slice(parsedNode.sourceEndIndex);
                      node.value = `${prefix}${infix}${suffix}`;
                    },
                  });
                  return;
                }
              }
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
