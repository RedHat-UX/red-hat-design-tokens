import StyleDictionary from 'style-dictionary';
const { fileHeader, formattedVariables } = StyleDictionary.formatHelpers;

/**
 * Lit CSS object
 * @type {import('style-dictionary').Format}
 * @example ```js
 * import { resetStyles } from '@rhds/tokens/reset.css.js';
 *
 * class RhJazzHands extends LitElement {
 *   // reset all RHDS variables to defaults
 *   static styles = [resetStyles];
 * }
 * ```
 */
export const litCss = {
  name: 'css/lit',
  formatter: ({ file, dictionary, options }) =>
    `${fileHeader({ file })}
import { css } from 'lit';
export const resetStyles = css\`
:host {
${formattedVariables({ format: 'css', dictionary, outputReferences: options.outputReferences })}
}\`;
export default resetStyles;`,
};
