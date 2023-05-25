# @rhds/tokens

## 1.1.2

### Patch Changes

- f820df6: Added `js/**/*.cjs` to files entry points patterns array

## 1.1.1

### Patch Changes

- a777f24: Fixes missing file exports

## 1.1.0

### Minor Changes

- 0766863: Adds token meta data export.

  ```js
  import { tokens } from "@rhds/tokens/meta.js";

  const family = tokens.get("--rh-font-family-body-text");
  console.log(family.$description);
  // 'The font family used for body text'
  ```

## 1.0.0

### Major Changes

- 098f83d: Moves editor files to their own dir: vscode to editor/vscode, etc
- b40b80a: Initial release 🎉

  ```sh
  npm i @rhds/tokens
  ```

- c6da2c5: Changed `black` crayon tokens to `gray` crayon tokens. This reflects the new
  color palette. This also required updates to the `gray` crayon token names and
  changes to semantic token values that use grays. **Note** that the new
  `--rh-color-grey-*` tokens do not line up with the old `--rh-color-black-*`
  tokens, so be sure to enact contrast testing on all your uses.

  | Before                 | After                |
  | ---------------------- | -------------------- |
  | `--rh-color-black-150` | `--rh-color-gray-05` |
  | `--rh-color-black-200` | `--rh-color-gray-20` |
  | `--rh-color-black-300` | `--rh-color-gray-30` |
  | `--rh-color-black-400` | `--rh-color-gray-40` |
  | `--rh-color-black-500` | `--rh-color-gray-50` |
  | `--rh-color-black-600` | `--rh-color-gray-60` |
  | `--rh-color-black-700` | `--rh-color-gray-70` |
  | `--rh-color-black-800` | `--rh-color-gray-80` |
  | `--rh-color-black-900` | `--rh-color-gray-90` |

- 17f0fff: **javascript**: Made each category available as a separate module

  Before:

  ```js
  import { Red300 } from "@rhds/tokens";

  element.style.color = Red300;
  ```

  After:

  ```js
  import { Red300 } from "@rhds/tokens/color.js";

  element.style.color = Red300.hex;
  ```

  Some values exported from `values.js` and from the various category modules are
  now structured data. This includes breakpoints, colours, shadows, and media
  queries.

- afbb74b: Removed `--rh-context` tokens, pending redesign of that feature
- d617cd0: Removed danger border color tokens, pending redesign of that feature

### Minor Changes

- cde3ef0: Improved exported typescript types, use string references in media tokens'
  javascript module representation
- 20b5fc0: Added `-hsl` and `-rgb` variants of crayon colours

  ```css
  background: rgb(var(--rh-color-red-100-rgb) / var(--rh-opacity-80));
  ```

- 487b9b2: Update packaged files to include css, scss, and editor files.
- 6f11643: - Adds textmate snippets in editor/textmate
  - Adds a VSCode VSIX extension bundle to github releases
  - Fixes the hexokinase regexp
- 1596d5d: Allows for markdown files as collection description
- 842d205: Adds breakpoint tokens.

  Since CSS does not allow custom properties in media queries, these should be used via the
  `ScreenSizeController` from `@rhds/elements`

  ```ts
  import { LitElement, html } from "lit";
  import { classMap } from "lit/directives/class-map.js";
  import { ScreenSizeController } from "@rhds/elements/lib/controllers/ScreenSizeController.js";

  @customElement("responsive-element")
  class ResponsiveElement extends LitElement {
    #screenSize = new ScreenSizeController(this);

    render() {
      const isMobilePortrait = this.#screenSize.matches.has("2xs");
      return html`
        <div id="#container" class="${classMap({ isMobilePortrait })}">...</div>
      `;
    }
  }
  ```

- ae98335: Adds a new Stylelint plugin, which validates and fixes token values in css files.

  ```
  npx stylelint elements/**/*.css --fix
  ```

  Also adds a new `tokens` map from the main export. The previous main have moved to './values.js';

  ```js
  import { tokens } from "@rhds/tokens";

  tokens.get("--rh-color-brand-red-on-light"); // '#ee0000';
  ```

### Patch Changes

- 1de1327: Changed the gray color associated with secondary text
- 594e64d: Support a limited set of languages in font-family
- 06eaa2c: Removed light-alt surface token
- 07c1e2c: Updated dependencies
- 2feacb7: Fixed VSIX build script for VSCode
- c0abeff: Add VSCode bundle to GitHub release
- 2541aeb: Removing Overpass from font stacks
- a1659d8: Converted length tokens from rem to px
- 3bf26ab: Fixed missing rgb and hsl values for gray colours
- b358a5d: Automatically add description from files
- e354fdf: Remapped new gray surface tokens and added a description for canvas tokens

## 1.0.0-beta.23

### Patch Changes

- ceea9a3: include js files when releasing in CI/CD

## 1.0.0-beta.22

### Minor Changes

- cde3ef0: Improved exported typescript types, use string references in media tokens'
  javascript module representation

## 1.0.0-beta.21

### Patch Changes

- 06eaa2c: Removed light-alt surface token

## 1.0.0-beta.20

### Major Changes

- 17f0fff: **javascript**: Made each category available as a separate module

  Before:

  ```js
  import { Red300 } from "@rhds/tokens";

  element.style.color = Red300;
  ```

  After:

  ```js
  import { Red300 } from "@rhds/tokens/color.js";

  element.style.color = Red300.hex;
  ```

  Some values exported from `values.js` and from the various category modules are
  now structured data. This includes breakpoints, colours, shadows, and media
  queries.

### Patch Changes

- e354fdf: Remapped new gray surface tokens and added a description for canvas tokens

## 1.0.0-beta.19

### Patch Changes

- 1de1327: Changed the gray color associated with secondary text

## 1.0.0-beta.18

### Major Changes

- c6da2c5: Changed `black` crayon tokens to `gray` crayon tokens. This reflects the new
  color palette. This also required updates to the `gray` crayon token names and
  changes to semantic token values that use grays. **Note** that the new
  `--rh-color-grey-*` tokens do not line up with the old `--rh-color-black-*`
  tokens, so be sure to enact contrast testing on all your uses.

  | Before                 | After                |
  | ---------------------- | -------------------- |
  | `--rh-color-black-150` | `--rh-color-gray-05` |
  | `--rh-color-black-200` | `--rh-color-gray-20` |
  | `--rh-color-black-300` | `--rh-color-gray-30` |
  | `--rh-color-black-400` | `--rh-color-gray-40` |
  | `--rh-color-black-500` | `--rh-color-gray-50` |
  | `--rh-color-black-600` | `--rh-color-gray-60` |
  | `--rh-color-black-700` | `--rh-color-gray-70` |
  | `--rh-color-black-800` | `--rh-color-gray-80` |
  | `--rh-color-black-900` | `--rh-color-gray-90` |

- afbb74b: Removed `--rh-context` tokens, pending redesign of that feature

## 1.0.0-beta.17

### Minor Changes

- 90207a2: 11ty: added expanded table rows for color variants
- bc80671: 11ty plugin: Fixed copy button

  - Fixed copy button when token values contain double-quotes
  - Used token colours for copy button
  - Made the docs extension key configurable (defaults to `com.redhat.ux`)

- 90207a2: 11ty: added `getTokenDocs` filter

### Patch Changes

- 07c1e2c: Updated dependencies

## 1.0.0-beta.16

### Patch Changes

- 0ba0357: Reverted removal of `--rh-border-width-sm` token

## 1.0.0-beta.15

### Patch Changes

- b358a5d: Automatically add description from files

## 1.0.0-beta.14

### Minor Changes

- 1596d5d: Allows for markdown files as collection description

### Patch Changes

- 7e3e976: Fixed a race condition in the 11ty plugin

## 1.0.0-beta.13

### Patch Changes

- 2feacb7: Fixed VSIX build script for VSCode

## 1.0.0-beta.12

### Minor Changes

- b74a17a: Added experimental 11ty plugin

## 1.0.0-beta.11

### Patch Changes

- 3bf26ab: Fixed missing rgb and hsl values for gray colours

## 1.0.0-beta.10

### Minor Changes

- 20b5fc0: Added `-hsl` and `-rgb` variants of crayon colours

  ```css
  background: rgb(var(--rh-color-red-100-rgb) / var(--rh-opacity-80));
  ```

### Patch Changes

- 2541aeb: Removing Overpass from font stacks

## 1.0.0-beta.9

### Patch Changes

- 1a18fab: More CI debugging
- 2f6494e: More CI debugging
- a33f75c: One more release ci fix for good measure
- c0abeff: Add VSCode bundle to GitHub release

## 1.0.0-beta.5

### Minor Changes

- 842d205: Adds breakpoint tokens.

  Since CSS does not allow custom properties in media queries, these should be used via the
  `ScreenSizeController` from `@rhds/elements`

  ```ts
  import { LitElement, html } from "lit";
  import { classMap } from "lit/directives/class-map.js";
  import { ScreenSizeController } from "@rhds/elements/lib/controllers/ScreenSizeController.js";

  @customElement("responsive-element")
  class ResponsiveElement extends LitElement {
    #screenSize = new ScreenSizeController(this);

    render() {
      const isMobilePortrait = this.#screenSize.has("mobile-portrait");
      return html`
        <div id="#container" class="${classMap({ isMobilePortrait })}">...</div>
      `;
    }
  }
  ```

## 1.0.0-beta.4

### Minor Changes

- 6f11643: - Adds textmate snippets in editor/textmate

  - Adds a VSCode VSIX extension bundle to github releases
  - Fixes the hexokinase regexp

  BREAKING CHANGES:

  - moves editor files to their own dir: vscode to editor/vscode, etc

## 1.0.0-beta.3

### Patch Changes

- a2ae38a: Corrected package exports

## 1.0.0-beta.2

### Minor Changes

- ae98335: Adds a new Stylelint plugin, which validates and fixes token values in css files.

  ```
  npx stylelint elements/**/*.css --fix
  ```

  Also adds a new `tokens` map from the main export. The previous main have moved to './values.js';

  ```js
  import { tokens } from "@rhds/tokens";

  tokens.get("--rh-color-brand-red-on-light"); // '#ee0000';
  ```

### Patch Changes

- 594e64d: Support a limited set of languages in font-family
- a1659d8: Converted length tokens from rem to px

## 1.0.0-beta.1

### Minor Changes

- 487b9b2: Update packaged files to include css, scss, and editor files.

## 1.0.0-beta.0

### Major Changes

- b40b80a: Initial release 🎉

  ```sh
  npm i @rhds/tokens@beta
  ```
