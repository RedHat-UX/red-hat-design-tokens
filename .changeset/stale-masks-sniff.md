---
"@rhds/tokens": major
---
**Colors**: Deprecates the `*-rgb` and `*-hsl` tokens. Use CSS color transforms instead

```diff
- color: rgb(var(--rh-color-orange-90-rgb) / var(--rh-opacity-10));
+ color: rgb(from var(--rh-color-orange-90) r g b / var(--rh-opacity-10));
```
