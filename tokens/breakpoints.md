When layouts change in size responding to screen size, visual elements may 
adjust their
size, hide, or otherwise adapt to compensate for gains or losses in screen real estate.

Red Hat's breakpoint tokens represent the **minimum**
[CSS pixel](https://developer.mozilla.org/en-US/docs/Glossary/CSS_pixel) width of a device's
screen, corresponding to the `min-width` media query so for example a device with a
screen width less than the `--rh-breakpoint-xs` token is considered a mobile
device in portrait mode, whereas a device with a screen width greater than the
`--rh-breakpoint-xl` token is considered a desktop with a large screen.

Since CSS currently does not allow custom properties in media queries, these tokens must be
uses in preprocessors or templating systems, or imported into JavaScript modules. We
recommend against importing these token values directly into components. In Red Hat's
Design System, we import them into a
[reactive controller](https://lit.dev/docs/composition/controllers/) which exposes
information about the screen size through a JavaScript API.

See also [media queries](#media-queries).

```js
static styles = css`
  @media (max-width: ${Breakpointxs}) {
    /* ... mobile portrait styles */
  }
`;
```
