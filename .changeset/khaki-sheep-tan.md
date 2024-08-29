---
"@rhds/tokens": minor
---
Added theme tokens for responsive colours. Read these in a themable container
such as `<rh-card>` to style themable content that responds to the color palette

```html
<rh-surface color-palette="lighter">
  <rh-card color-palette="darkest">
    <p>That way, colours respond to their parents' <code>color-palette</code>
       Without requiring <a href="#">custom CSS</a></p>
  </rh-card>
  <p>Use <a href="#">theme tokens</a> for best results.
</rh-surface>
```

```css
rh-surface {
  & a {
    color: var(--rh-color-interactive-blue-normal);
    &:hover,
    &:focus-within,
    &:active { color: var(--rh-color-interactive-blue-emphasized); }
    &:visited {
      color: var(--rh-color-interactive-purple-normal);
      &:hover,
      &:focus-within,
      &:active { color: var(--rh-color-interactive-purple-emphasized); }
    }
  }
}
```

For more information, please see our [theming docs](https://ux.redhat.com/themeing).
