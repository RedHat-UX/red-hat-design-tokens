---
"@rhds/tokens": major
---
#### Theming and color schemes

- Remove the `.on.light` and `.on.dark` selectors from color-context stylesheets. Uses `light-dark()` instead.
- Rename the file `color-context-consumer.css` to `default-theme.css` as well as it's associated JavaScript modules
- Rename the file `color-context-provider.css` to `color-palette.css` as well as it's associated JavaScript modules

The default theme is now a global stylesheet. For best performance, we recommend 
loading it early on in the page. However, if you forget to load it, themable 
elements will load it themselves.

```html
<head>
  <!-- load default RHDS theme, which was copied from the NPM package to /assets -->
  <link rel="stylesheets" href="/assets/packages/@rhds/tokens/css/default-theme.css">
```
