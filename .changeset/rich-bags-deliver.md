---
"@rhds/tokens": minor
---

Added status tokens

```css
button {
  .light &.danger {
    background: var(--rh-color-status-danger-on-light);
  }
  .light &.success {
    background: var(--rh-color-status-success-on-light);
  }
  .dark &.danger {
    background: var(--rh-color-status-danger-on-dark);
  }
  .dark &.success {
    background: var(--rh-color-status-success-on-dark);
  }
}
```
