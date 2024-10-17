import type { Format } from 'style-dictionary/types';
import { fileHeader, formattedVariables } from 'style-dictionary/utils';

export function constructStyleSheet(css: string) {
  return `import { css } from 'lit'; export default css\`${css.trimEnd()}\`;`;
}
/**
 * Lit CSS object
 * @example ```js
 * import { resetStyles } from '@rhds/tokens/reset.css.js';
 *
 * class RhJazzHands extends LitElement {
 *   // reset all RHDS variables to defaults
 *   static styles = [resetStyles];
 * }
 * ```
 */
export const litCss: Format = {
  name: 'css/lit',
  format: async ({ file, dictionary, options }) =>
    `${await fileHeader({ file })}${constructStyleSheet(/* css */`
:host {
${formattedVariables({ format: 'css', dictionary, ...options })}
}`)}`,
};
