---
"@rhds/tokens": patch
---

Fixed duplicate red orange token

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
