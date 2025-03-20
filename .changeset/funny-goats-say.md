---
"@rhds/tokens": major
---
**TypeScript**: Improves the TypeScript developer experience. Introduces well 
typed tokens maps. Get auto-complete in your IDE when calling 
`tokens.get('--rh-')`, for example. TypeScript will also correctly return the 
type of `get` and `has` calls, so no more type assertions

```diff
  const value = tokens.get('--rh-line-height-code');
- expect(lightHeight).to.equal(value as number);
+ expect(lightHeight).to.equal(value);
```

Theming tokens also no longer return `null`, but rather their computed 
`light-dark()` values, with fallback.

This release also makes the tokens and metadata maps *read only*. If you were 
relying on `instanceof Map` checks in your code, they will no longer work

```ts
import {tokens} from '@rhds/tokens';
// no longer works
tokens.set('--rh-color-surface-dark', 'blue');
// no longer works
if (tokens instanceof Map) {
  // ...
}
```
