Each theme features two shades of blue, one for Link and Focus states and one for Hover
and Active states. Use the `--rh-interactive-(blue|purple)-(normal|emphasized)` theme
tokens in order to style content of themable containers like `<rh-surface>`

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

