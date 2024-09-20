---
"@rhds/tokens": minor
---

Align status tokens across color categories by:

- Update status token values for danger, warning, caution, neutral, and success

- Add info status token, which should be used in place of note status token going forward


- Ensure consistent status color names by aliasing inconsistent names with new names:

Before:
```
    color.status.note.on-light:
        $value: color.purple.50
```

After:
```
    color.status.note.on-light:
        $value: color.status.info.on-light
```

- Alias icon and border status token values to status tokens

Before:
```
    color.icon.status.success.on-light:
        $value: color.green.60
```

After:
```
    color.icon.status.success.on-light:
        $value: color.status.success.on-light
```

- Update surface color status token names and values