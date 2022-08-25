---
"@rhds/tokens": minor
---

Adds a new Stylelint plugin, which validates and fixes token values in css files.

```
npx stylelint elements/**/*.css --fix
```

Also adds a new `tokens` map from the main export. The previous main have moved to './values.js';

```js
import { tokens } from "@rhds/tokens";

tokens.get("--rh-color-brand-red-on-light"); // '#ee0000';
```
