---
"@rhds/tokens": minor
---

Adds token meta data export.

```js
import { tokens } from '@rhds/tokens/meta.js';

const family = tokens.get('--rh-font-family-body-text');
console.log(family.$description);
// 'The font family used for body text'
```
