import type { Rule } from 'stylelint';

import { readFileSync } from 'node:fs';
import { dirname, join, sep } from 'node:path';
import { tokens, type TokenName } from '@rhds/tokens';

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

// Reading and parsing a CEM for every declaration would be unnecessarily
// expensive. Cache the allowed property names by manifest path for the life of
// the Stylelint process instead.
const cemCache = new Map<string, Set<string>>();

/**
 * Collect component-level `--rh-*` properties from a Custom Elements Manifest.
 * These properties are valid public APIs, but they do not appear in the global
 * design-token registry and would otherwise be reported as unknown tokens.
 */
function getCemAllowed(cemPath: string) {
  if (cemCache.has(cemPath)) {
    return cemCache.get(cemPath)!;
  }

  const allowed = new Set<string>();

  try {
    const cem = JSON.parse(readFileSync(cemPath, 'utf8'));
    // CSS custom properties are declared on custom-element class declarations
    // in the CEM schema. Ignore non-custom-element declarations and non-RHDS
    // properties so the manifest does not broadly disable this rule.
    for (const mod of cem?.modules ?? []) {
      for (const declaration of mod.declarations ?? []) {
        if (declaration.customElement) {
          for (const cssProperty of declaration.cssProperties ?? []) {
            if (cssProperty.name.startsWith('--rh')) {
              allowed.add(cssProperty.name);
            }
          }
        }
      }
    }
  } catch {
    // Treat a missing or invalid optional manifest as having no allowed names;
    // normal unknown-token validation should continue to run.
  }

  cemCache.set(cemPath, allowed);
  return allowed;
}

const ruleFunction: Rule = (_, opts) => {
  return (root, result) => {
    // Component styles conventionally live under */rh-tagname/rh-tagname.css.
    // Values using that component's own prefix are local custom properties,
    // not global token names. Inline CSS may not provide a source filename, so
    // guard access to the input metadata.
    const tagName = root.source?.input?.file
      ? dirname(root.source.input.file).split(sep).findLast(x => x.startsWith('rh-'))
      : undefined;
    const validOptions = stylelint.utils.validateOptions(result, ruleName);

    if (!validOptions) {
      return;
    }

    const migrations = new Map(Object.entries(opts?.migrations ?? {}));
    const allowed = new Set(opts?.allowed ?? []);
    if (opts?.cem) {
      // Resolve relative CEM paths the same way Stylelint resolves project
      // configuration: from the process working directory.
      for (const name of getCemAllowed(join(process.cwd(), opts.cem))) {
        allowed.add(name);
      }
    }

    root.walk(node => {
      if (node.type === 'decl') {
        const parsedValue = parser(node.value);
        parsedValue.walk(parsed => {
          if (parsed.type === 'function' && parsed.value === 'var') {
            const [child] = parsed.nodes ?? [];
            const { value } = child;
            if (value.startsWith('--rh')
                && !value.startsWith(`--${tagName}`)
                && !tokens.has(value)
                && !allowed.has(value)
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
