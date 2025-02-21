# @rhds/tokens

## 2.2.1

### Patch Changes

- 2fd6b6b: Added missing typescript type declarations

## 2.2.0

### Minor Changes

- 5e275cd: Added the following `-80` primitive color tokens:

  - `red-80`
  - `orange-80`
  - `yellow-80`
  - `teal-80`
  - `purple-80`

  Changed the value of `--rh-color-brand-red-darkest` from `--rh-color-red-70` to `--rh-color-red-80`

## 2.1.1

### Patch Changes

- 75e4dda: - Added language specific font-family tokens. Example: `--rh-font-family-lang-he: 'Noto Sans Hebrew';`

  - Removes language fonts from `--rh-font-family-body-text` and `--rh-font-family-heading`

  Before:

  ```css
  body {
    font-family: var(
      --rh-font-family-body-text,
      RedHatText,
      "Red Hat Text",
      "Noto Sans Arabic",
      "Noto Sans Hebrew",
      "Noto Sans JP",
      "Noto Sans KR",
      "Noto Sans Malayalam",
      "Noto Sans SC",
      "Noto Sans TC",
      "Noto Sans Thai",
      Helvetica,
      Arial,
      sans-serif
    );
  }

  :is(h1, h2, h3, h4, h5, h6) {
    font-family: var(
      --rh-font-family-heading,
      RedHatDisplay,
      "Red Hat Display",
      "Noto Sans Arabic",
      "Noto Sans Hebrew",
      "Noto Sans JP",
      "Noto Sans KR",
      "Noto Sans Malayalam",
      "Noto Sans SC",
      "Noto Sans TC",
      "Noto Sans Thai",
      Helvetica,
      Arial,
      sans-serif
    );
  }
  ```

  After:

  ```css
  body {
    font-family: var(--rh-font-family-body-text, RedHatText, "Red Hat Text");
  }

  :is(h1, h2, h3, h4, h5, h6) {
    font-family: var(
      --rh-font-family-heading,
      RedHatDisplay,
      "Red Hat Display"
    );
  }

  [lang="he"] {
    font-family: var(--rh-font-family-lang-he: "Noto Sans Hebrew");
  }

  [lang="zh-CN"] {
    font-family: var(--rh-font-family-lang-zh-cn: "Noto Sans SC");
  }
  ```

- f4f68be: Removed empty color theme tokens from `_variables.scss`
- aea6a9f: Change the value for regular font weight token (`var(--rh-font-weight-heading-regular, 300)`) for headings from `300` to `400`

## 2.1.0

### Minor Changes

- 9d914cc: ✨ Added interactive tokens, and **DEPRECATES** the older interactive tokens

  ```diff
  - color: var(--rh-color-interactive-blue-darker);
  + color: var(--rh-color-interactive-primary-default-on-light);
  - color: var(--rh-color-interactive-purple-darker);
  + color: var(--rh-color-interactive-primary-visited-default-on-light);
  ```

- 9d914cc: Added theme tokens for responsive colours. Read these in a themable container
  such as `<rh-card>` to style themable content that responds to the color palette

  ```html
  <rh-surface color-palette="lighter">
    <p>Use <a href="#">theme tokens</a> for best results.</p>
    <p>
      <rh-card color-palette="darkest">
        <p>
          That way, colours respond to their parents'
          <code>color-palette</code> Without requiring
          <a href="#">custom CSS</a>
        </p>
      </rh-card>
    </p></rh-surface
  >
  ```

  ```css
  rh-surface {
    & a {
      color: var(--rh-color-interactive-primary-default);
      &:hover {
        color: var(--rh-color-interactive-primary-hover);
      }
      &:focus-within {
        color: var(--rh-color-interactive-primary-focus);
      }
      &:active {
        color: var(--rh-color-interactive-primary-active);
      }
      &:visited {
        color: var(--rh-color-interactive-primary-visited);
        &:hover {
          color: var(--rh-color-interactive-primary-visited-hover);
        }
        &:focus-within {
          color: var(--rh-color-interactive-primary-visited-focus);
        }
        &:active {
          color: var(--rh-color-interactive-primary-visited-active);
        }
      }
    }
  }
  ```

  For more information, please see our [theming docs](https://ux.redhat.com/themeing).

- b64dd32: ✨ Added status tokens:

  RHDS describes six statuses: `danger`, `warning`, `caution`, `neutral`, `note`, and `success`.

  ```css
  button {
    &.danger {
      background: var(--rh-color-status-danger);
    }
    &.warning {
      background: var(--rh-color-status-warning);
    }
    &.caution {
      background: var(--rh-color-status-caution);
    }
    &.neutral {
      background: var(--rh-color-status-neutral);
    }
    &.note {
      background: var(--rh-color-status-note);
    }
    &.success {
      background: var(--rh-color-status-success);
    }
  }
  ```

- a9edc95: Stylelint: added `allowed` option to `rhds/no-unknown-token-name`

  ```yaml
  rules:
    rhds/no-unknown-token-name:
      - true
      - allowed:
          - --rh-icon-color
  ```

- 6e2e3da: Align status tokens across color categories by:

  - Update surface color status token names and values
  - Update status token values for `danger`, `warning`, `caution`, `neutral`, and `success`
  - Add `info` status token, which should be used in place of `note` status token going forward
  - Ensure consistent status color names by aliasing inconsistent names with new names:
    ```diff
    - color: var(--rh-color-status-note-on-light,
    + color: var(--rh-color-status-info-on-light,
        var(--rh-color-purple-50, #5e40be))
    ```
  - Alias icon and border status token values to status tokens
    ```diff
    - color: var(--rh-color-icon-status-success-on-light,
    -   var(--rh-color-green-60, #3d7317));
    + color: var(--rh-color-icon-status-success-on-light,
    +   var(--rh-color-status-success-on-light,
    +     var(--rh-color-green-60, #3d7317));
    ```

### Patch Changes

- 9d914cc: added stops to textmate snippets

## 2.1.0-next.9

### Minor Changes

- a9edc95: Stylelint: added `allowed` option to `rhds/no-unknown-token-name`

  ```yaml
  rules:
    rhds/no-unknown-token-name:
      - true
      - allowed:
          - --rh-icon-color
  ```

## 2.1.0-next.0

### Minor Changes

- 9d914cc: ✨ Added interactive tokens, and **DEPRECATES** the older interactive tokens

  ```diff
  - color: var(--rh-color-interactive-blue-darker);
  + color: var(--rh-color-interactive-primary-default-on-light);
  - color: var(--rh-color-interactive-purple-darker);
  + color: var(--rh-color-interactive-primary-visited-default-on-light);
  ```

- 9d914cc: Added theme tokens for responsive colours. Read these in a themable container
  such as `<rh-card>` to style themable content that responds to the color palette

  ```html
  <rh-surface color-palette="lighter">
    <p>Use <a href="#">theme tokens</a> for best results.</p>
    <rh-card color-palette="darkest">
      <p>
        That way, colours respond to their parents'
        <code>color-palette</code> Without requiring <a href="#">custom CSS</a>
      </p>
    </rh-card>
  </rh-surface>
  ```

  ```css
  rh-surface {
    & a {
      color: var(--rh-color-interactive-primary-default);
      &:hover {
        color: var(--rh-color-interactive-primary-hover);
      }
      &:focus-within {
        color: var(--rh-color-interactive-primary-focus);
      }
      &:active {
        color: var(--rh-color-interactive-primary-active);
      }
      &:visited {
        color: var(--rh-color-interactive-primary-visited);
        &:hover {
          color: var(--rh-color-interactive-primary-visited-hover);
        }
        &:focus-within {
          color: var(--rh-color-interactive-primary-visited-focus);
        }
        &:active {
          color: var(--rh-color-interactive-primary-visited-active);
        }
      }
    }
  }
  ```

  For more information, please see our [theming docs](https://ux.redhat.com/themeing).

- b64dd32: ✨ Added status tokens:

  RHDS describes six statuses: `danger`, `warning`, `caution`, `neutral`, `note`, and `success`.

  ```css
  button {
    &.danger {
      background: var(--rh-color-status-danger);
    }
    &.warning {
      background: var(--rh-color-status-warning);
    }
    &.caution {
      background: var(--rh-color-status-caution);
    }
    &.neutral {
      background: var(--rh-color-status-neutral);
    }
    &.note {
      background: var(--rh-color-status-note);
    }
    &.success {
      background: var(--rh-color-status-success);
    }
  }
  ```

### Patch Changes

- 9d914cc: added stops to textmate snippets

## 2.0.1

### Patch Changes

- 3c18e2c: Stylelint: avoid some false-positives when linting [component token names][wiki].

  [wiki]: https://github.com/RedHat-UX/red-hat-design-system/wiki/CSS-Styles#tokens-and-naming-conventions

## 2.0.0

### Major Changes

- 41125df: # Crayon color updates

  Crayon color token names and values were changed to match the [new Red Hat color palette](https://www.redhat.com/en/about/brand/standards/color).

  To help you make these changes, use the [RHDS Stylelint Plugin](https://github.com/RedHat-UX/red-hat-design-tokens/tree/main/plugins/stylelint).If you'd like more information about Stylelint, visit [stylelint.io](http://stylelint.io/).

  Stylelint's migration rule can take a dictionary of names to migrate, and if it finds one of the specified names, it will automatically replace it with the new one. The rules below indicate how color tokens in 1.0 map to those in 2.0 and can be copied and pasted into your own repo.

  ```yaml
  rules:
    rhds/no-unknown-token-names:
      - true
      - migrations:
          # reds
          --rh-color-red-50: --rh-color-red-10
          --rh-color-red-100: --rh-color-red-20
          --rh-color-red-200: --rh-color-red-30
          --rh-color-red-300: --rh-color-red-40
          --rh-color-red-400: --rh-color-red-50
          --rh-color-red-500: --rh-color-red-50
          --rh-color-red-600: --rh-color-red-60
          --rh-color-red-700: --rh-color-red 60
          --rh-color-red-800: --rh-color-red-70
          # oranges
          --rh-color-orange-50: --rh-color-orange-10
          --rh-color-orange-100: --rh-color-orange-30
          --rh-color-orange-300: --rh-color-orange-40
          --rh-color-orange-500: --rh-color-orange-60
          --rh-color-orange-700: --rh-color-orange-70
          # yellows (previously golds)
          --rh-color-gold-50: --rh-color-yellow-10
          --rh-color-gold-400: --rh-color-yellow-40
          --rh-color-gold-600: --rh-color-yellow-70
          # greens
          --rh-color-green-50: --rh-color-green-10
          --rh-color-green-100: --rh-color-green-20
          --rh-color-green-500: --rh-color-green-60
          --rh-color-green-600: --rh-color-green-70
          # teals (previously cyans)
          --rh-color-cyan-50: --rh-color-teal-10
          --rh-color-cyan-100: --rh-color-teal-30
          --rh-color-cyan-300: --rh-color-teal-50
          --rh-color-cyan-400: --rh-color-teal-60
          --rh-color-cyan-500: --rh-color-teal-70
          # blues
          --rh-color-blue-50: --rh-color-blue-10
          --rh-color-blue-100: --rh-color-blue-20
          --rh-color-blue-200: --rh-color-blue-30
          --rh-color-blue-250: --rh-color-blue-40
          --rh-color-blue-400: --rh-color-blue-50
          --rh-color-blue-500: --rh-color-blue-60
          --rh-color-blue-600: --rh-color-blue-70
          # purples
          --rh-color-purple-50: --rh-color-purple-10
          --rh-color-purple-100: --rh-color-purple-20
          --rh-color-purple-300: --rh-color-purple-40
          --rh-color-purple-500: --rh-color-purple-60
          --rh-color-purple-700: --rh-color-purple-70
          # grays
          --rh-color-gray-05: --rh-color-gray-10
          --rh-color-gray-10: --rh-color-gray-20
          --rh-color-gray-20: --rh-color-gray-30
          --rh-color-gray-30: --rh-color-gray-40
          --rh-color-gray-40: --rh-color-gray-50
          --rh-color-gray-50: --rh-color-gray-60
          --rh-color-gray-60: --rh-color-gray-70
          --rh-color-gray-70: --rh-color-gray-80
          --rh-color-gray-80: --rh-color-gray-90
          --rh-color-gray-90: --rh-color-gray-95
          --rh-color-black: --rh-color-gray-100
  ```

  There are several new crayon color tokens that have been added and do not directly map to a 1.0 token. These include:

  - `--rh-color-red-orange-10`
  - `--rh-color-red-orange-20`
  - `--rh-color-red-orange-30`
  - `--rh-color-red-orange-40`
  - `--rh-color-red-orange-50`

  - `--rh-color-orange-20`
  - `--rh-color-orange-50`

  - `--rh-color-yellow-20`
  - `--rh-color-yellow-30`
  - `--rh-color-yellow-50`
  - `--rh-color-yellow-60`

  - `--rh-color-green-30`
  - `--rh-color-green-40`
  - `--rh-color-green-50`

  - `--rh-color-teal-20`
  - `--rh-color-teal-40`

  - `--rh-color-purple-30`
  - `--rh-color-purple-50`

  ## Semantic token value changes

  The following semantic token values changed, but the token names did not. In many cases, you may automatically migrate these tokens using the `rhds/token-values` stylelint rule.

  ```yaml
  rules:
    rhds/token-values: true
  ```

  ### Accent

  | Semantic token          | Old crayon token value | New crayon token value |
  | ----------------------- | ---------------------- | ---------------------- |
  | `accent-base-on-light`  | `blue-400`             | `blue-50`              |
  | `accent-base-on-dark`   | `blue-200`             | `blue-30`              |
  | `accent-brand-on-light` | `red-500`              | `brand-red-on-light`   |
  | `accent-brand-on-dark`  | `red-400`              | `brand-red-on-dark`    |

  ### Border

  | Semantic token                | Old crayon token value | New crayon token value |
  | ----------------------------- | ---------------------- | ---------------------- |
  | `border-strong-on-light`      | `gray-90`              | `gray-95`              |
  | `border-strong-on-dark`       | `white`                | `white`                |
  | `border-subtle-on-light`      | `gray-20`              | `gray-30`              |
  | `border-subtle-on-dark`       | `gray-40`              | `gray-50`              |
  | `border-interactive-on-light` | `blue-400`             | `blue-50`              |
  | `border-interactive-on-dark`  | `blue-200`             | `blue-30`              |

  ### Brand

  | Semantic token       | Old crayon token value | New crayon token value |
  | -------------------- | ---------------------- | ---------------------- |
  | `brand-red-lightest` | `red-100`              | `red-10`               |
  | `brand-red-lighter`  | `red-200`              | `red-20`               |
  | `brand-red-light`    | `red-300`              | `red-40`               |
  | `brand-red-dark`     | `red-600`              | `red-60`               |
  | `brand-red-darker`   | `red-700`              | `red-70`               |
  | `brand-red-darkest`  | `red-800`              | `red-70`               |
  | `brand-red-on-light` | `red-500`              | `red-50`               |
  | `brand-red-on-dark`  | `red-400`              | `red-50`               |

  ### Canvas

  | Semantic token | Old crayon token value | New crayon token value |
  | -------------- | ---------------------- | ---------------------- |
  | `canvas-white` | `white`                | `white`                |
  | `canvas-black` | `gray-90`              | `gray-95`              |

  ### Icon

  | Semantic token            | Old crayon token value | New crayon token value |
  | ------------------------- | ---------------------- | ---------------------- |
  | `icon-primary-on-light`   | `brand-red-on-light`   | `brand-red-on-light`   |
  | `icon-primary-on-dark`    | `brand-red-on-dark`    | `brand-red-on-dark`    |
  | `icon-secondary-on-light` | `gray-90`              | `gray-95`              |
  | `icon-secondary-on-dark`  | `white`                | `gray-50`              |
  | `icon-subtle`             | `gray-40`              | `gray-50`              |
  | `icon-subtle-hover`       | `gray-30`              | `gray-40`              |

  ### Interactive

  | Semantic token                | Old crayon token value | New crayon token value |
  | ----------------------------- | ---------------------- | ---------------------- |
  | `interactive-blue-lightest`   | `blue-100`             | `blue-20`              |
  | `interactive-blue-lighter`    | `blue-200`             | `blue-30`              |
  | `interactive-blue-darker`     | `blue-400`             | `blue-50`              |
  | `interactive-blue-darkest`    | `blue-500`             | `blue-70`              |
  | `interactive-purple-lightest` | `purple-100`           | `purple-10`            |
  | `interactive-purple-lighter`  | `purple-300`           | `purple-30`            |
  | `interactive-purple-darker`   | `purple-500`           | `purple-50`            |
  | `interactive-purple-darkest`  | `purple-700`           | `purple-70`            |

  ### Surface

  | Semantic token     | Old crayon token value | New crayon token value |
  | ------------------ | ---------------------- | ---------------------- |
  | `surface-lightest` | `white`                | `white`                |
  | `surface-lighter`  | `gray-05`              | `gray-10`              |
  | `surface-light`    | `gray-10`              | `gray-20`              |
  | `surface-dark`     | `gray-60`              | `gray-70`              |
  | `surface-dark-alt` | `gray-70`              | `gray-80`              |
  | `surface-darker`   | `gray-80`              | `gray-90`              |
  | `surface-darkest`  | `gray-90`              | `gray-95`              |

  ### Text

  | Semantic token            | Old crayon token value | New crayon token value |
  | ------------------------- | ---------------------- | ---------------------- |
  | `text-primary-on-light`   | `gray-90`              | `gray-95`              |
  | `text-primary-on-dark`    | `white`                | `white`                |
  | `text-secondary-on-light` | `gray-50`              | `gray-60`              |
  | `text-secondary-on-dark`  | `gray-20`              | `gray-30`              |
  | `text-brand-on-light`     | `red-500`              | `brand-red-on-light`   |
  | `text-brand-on-dark`      | `red-400`              | `brand-red-on-dark`    |

### Minor Changes

- c793fd8: Makes css property fallbacks a snippet placeholder, letting users more easily
  choose between the fallback and non-fallback forms
  ```css
  padding: var(--rh-space-xs, 4px);
  margin: var(--rh-space-xs);
  ```

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
