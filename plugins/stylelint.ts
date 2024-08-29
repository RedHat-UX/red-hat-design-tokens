import rules from './stylelint/rules.js';
import stylelint from 'stylelint';

export default rules.map(ruleFunction =>
  stylelint.createPlugin(ruleFunction.ruleName, ruleFunction));
