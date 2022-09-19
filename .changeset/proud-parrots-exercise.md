---
"@rhds/tokens": minor
---

Adds breakpoint tokens.

Since CSS does not allow custom properties in media queries, these should be used via the
`ScreenSizeController` from `@rhds/elements`

```ts
import { LitElement, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ScreenSizeController } from '@rhds/elements/lib/controllers/ScreenSizeController.js';

@customElement('responsive-element')
class ResponsiveElement extends LitElement {
  #screenSize = new ScreenSizeController(this);

  render() {
    const isMobilePortrait = this.#screenSize.has('mobile-portrait');
    return html`
      <div id="#container" class="${classMap({ isMobilePortrait })}">
        ...
      </div>
    `;
  }
}
```
