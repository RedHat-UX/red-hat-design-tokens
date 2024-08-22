import type { Format } from 'style-dictionary/types'
import { fileHeader, formattedVariables } from 'style-dictionary/utils'

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
  format: ({ file, dictionary, options }) =>
    `${fileHeader({ file })}
import { css } from 'lit';
export const resetStyles = css\`
:host {
${formattedVariables({
  format: 'css',
  dictionary,
  ...options,
})}
}\`;
export default resetStyles;`,
};
