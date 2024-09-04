---
"@rhds/tokens": minor
---
Added theme tokens for responsive colours. Read these in a themable container
such as `<rh-card>` to style themable content that responds to the color palette

```html
<rh-surface color-palette="lighter">
  <p>Use <a href="#">theme tokens</a> for best results.<p>
  <rh-card color-palette="darkest">
    <p>That way, colours respond to their parents' <code>color-palette</code>
       Without requiring <a href="#">custom CSS</a></p>
  </rh-card>
</rh-surface>
```

```css
rh-surface {
  & a {
    color: var(--rh-color-interactive-primary-default);
    &:hover { color: var(--rh-color-interactive-primary-hover); }
    &:focus-within { color: var(--rh-color-interactive-primary-focus); }
    &:active { color: var(--rh-color-interactive-primary-active); }
    &:visited {
      color: var(--rh-color-interactive-primary-visited);
      &:hover { color: var(--rh-color-interactive-primary-visited-hover); }
      &:focus-within { color: var(--rh-color-interactive-primary-visited-focus); }
      &:active { color: var(--rh-color-interactive-primary-visited-active); }
    }
  }
}
```

For more information, please see our [theming docs](https://ux.redhat.com/themeing).
