---
"@rhds/tokens": minor
---

**Stylelint**: Added Custom Elements Manifest support to
`rhds/no-unknown-token-name`. Use the new `cem` option to allow component custom
properties declared in the manifest without maintaining a separate `allowed`
list.

```yaml
rules:
  rhds/no-unknown-token-name:
    - true
    - cem: custom-elements.json
```

Improved `rhds/token-values` validation for themable tokens. Structurally
equivalent `light-dark()` fallbacks no longer fail validation because of
formatting differences, while invalid branches are still autofixed.
