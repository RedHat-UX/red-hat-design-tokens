Each theme features two shades of blue for primary interactive (e.g. link) content
colors: one for the default state, and one shared by the hover, focus, and active
states. Use the `--rh-color-interactive-primary-*` theme tokens to style content of
themable containers like `<rh-surface>`.

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
      color: var(--rh-color-interactive-primary-visited-default);
      &:hover { color: var(--rh-color-interactive-primary-visited-hover); }
      &:focus-within { color: var(--rh-color-interactive-primary-visited-focus); }
      &:active { color: var(--rh-color-interactive-primary-visited-active); }
    }
  }
}
```
