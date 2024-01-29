---
"@rhds/tokens": minor
---

Added status tokens

Example use case:
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

Fix duplicate red orange token

Before:
```yaml
  40:
    $value: '#F4784A'
  50:
    $value: '#F4784A'
```

After:
```yaml
  40:
    $value: '#F4784A'
  50:
    $value: '#F0561D'
```
