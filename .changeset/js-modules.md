---
"@rhds/tokens": major
---
**javascript**: Made each category available as a separate module

Before:

```js
import { Red300 } from '@rhds/tokens';

element.style.color = Red300;
```

After:

```js
import { Red300 } from '@rhds/tokens/color.js';

element.style.color = Red300.hex;
```

Some values exported from `values.js` and from the various category modules are 
now structured data. This includes breakpoints, colours, shadows, and media 
queries.
