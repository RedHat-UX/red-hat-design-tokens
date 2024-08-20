import rules from './stylelint/rules.js';
import { createPlugin } from 'stylelint';

export default rules.map(ruleFunction =>
  createPlugin(ruleFunction.ruleName, ruleFunction));
