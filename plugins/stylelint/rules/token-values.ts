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
 * Extract exactly two arguments from a `light-dark()` value. Each argument
 * must be a single significant node, but it can be any kind of node.
 */
function extractLightDarkArgs(parsed: parser.ParsedValue) {
  const significantNodes = parsed.nodes.filter(node => node.type !== 'space');
  const [lightDark] = significantNodes;
  if (!lightDark
      || significantNodes.length !== 1
      || lightDark.type !== 'function'
      || lightDark.value !== 'light-dark') {
    return null;
  }

  const args: parser.Node[][] = [[]];
  for (const node of lightDark.nodes) {
    if (node.type === 'div' && node.value === ',') {
      args.push([]);
    } else if (node.type !== 'space') {
      args[args.length - 1].push(node);
    }
  }

  if (args.length !== 2 || args.some(arg => arg.length !== 1)) {
    return null;
  }

  return args;
}

/**
 * Return whether an argument is a direct `var()` call for a known RHDS token.
 */
function isRhdsTokenVarArg(arg: parser.Node[]) {
  const [variable] = arg;
  if (!variable || variable.type !== 'function' || variable.value !== 'var') {
    return false;
  }

  const [nameNode] = variable.nodes.filter(node => node.type !== 'space');
  return nameNode?.type === 'word'
    && nameNode.value.startsWith('--rh-')
    && tokens.has(nameNode.value as TokenName);
}

/**
 * Compare the RHDS token `var()` arguments in a theme-aware fallback. A null
 * result means the expected value is not in the supported shape and should use
 * string comparison.
 */
function lightDarkMatches(actual: string, expected: string) {
  const expectedArgs = extractLightDarkArgs(parser(expected));
  if (!expectedArgs || !expectedArgs.every(isRhdsTokenVarArg)) {
    return null;
  }

  const actualArgs = extractLightDarkArgs(parser(actual));
  if (!actualArgs) {
    return false;
  }

  return actualArgs.every((actualArg, index) => {
    const expectedArg = expectedArgs[index];
    return !!expectedArg
      && isRhdsTokenVarArg(actualArg)
      && parser.stringify(actualArg) === parser.stringify(expectedArg);
  });
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
