---
"@rhds/tokens": minor
---

Added status tokens

```css
button {
  .light &.danger {
    background: var(--rh-color-danger-on-light);
  }
  .light &.success {
    background: var(--rh-color-success-on-light);
  }
  .dark &.danger {
    background: var(--rh-color-danger-on-dark);
  }
  .dark &.success {
    background: var(--rh-color-success-on-dark);
  }
}
```
