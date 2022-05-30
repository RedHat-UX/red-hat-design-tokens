# Red Hat Design Tokens

[Design Tokens](https://design-tokens.github.io/community-group/format/) for Red Hat's [Digital Design System](https://ux.redhat.com).

## 🚚 Installation
```sh
npm i @rhds/tokens
```

## 🎭 Usage
Apply defaults to the document root by importing the global stylesheet:
```html
<link rel="stylesheet" href="/url/to/@rhds/tokens/css/global.css">
<style>
  :is(h1, h2, h3, h4, h5, h6) {
    font-family: var(--rh-font-family-heading);
  }
</style>
```

Reset a component's styles (preventing inheritance) by adding `resetStyles` to it's static Constructible Style Sheet list:
```ts
import { resetStyles } from '@rhds/tokens/css/reset.css.js';
import style from './rh-jazz-hands.css';

@customElement('rh-jazz-hands')
class RhJazzHands extends LitElement {
  static readonly styles = [resetStyles, style];
}
```

Import tokens as JavaScript objects:
```js
import { ColorBlue300 } from '@rhds/tokens';

html`
  <span style="color: ${ColorBlue300}">
`
```
*NOTE:* We *strongly* recommend using CSS variables (and accompanying snippets) instead of importing tokens as JavaScript objects.

Load snippets in VSCode:
> Search for `Red Hat Design System` in the VSCode marketplace

Load snippets in neovim via LuaSnips:
```lua
require 'luasnip.loaders.from_vscode'.lazy_load { paths = {
  -- Path to the built project, perhaps in your `node_modules`
  "~/Developer/redhat-ux/red-hat-design-tokens"
} }
```

## Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md)

