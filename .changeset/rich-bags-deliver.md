---
"@rhds/tokens": minor
---

✨ Added status tokens:

RHDS describes six statuses: `danger`, `warning`, `caution`, `neutral`, `note`, and `success`.

```css
button {
  &.danger { background: var(--rh-color-status-danger); }
  &.warning { background: var(--rh-color-status-warning); }
  &.caution { background: var(--rh-color-status-caution); }
  &.neutral { background: var(--rh-color-status-neutral); }
  &.note { background: var(--rh-color-status-note); }
  &.success { background: var(--rh-color-status-success); }
}
```
