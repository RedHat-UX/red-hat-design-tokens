---
"@rhds/tokens": minor
---

Align status tokens across color categories by:

- Update surface color status token names and values
- Update status token values for `danger`, `warning`, `caution`, `neutral`, and `success`
- Add `info` status token, which should be used in place of `note` status token going forward
- Ensure consistent status color names by aliasing inconsistent names with new names:  
  ```diff
  - color: var(--rh-color-status-note-on-light,
  -   var(--rh-color-purple-50, #5e40be))
  + color: var(--rh-color-status-info-on-light,
  +  var(--rh-color-purple-50, #5e40be))
  ```
- Alias icon and border status token values to status tokens  
  ```diff
  - color: var(--rh-color-icon-status-success-on-light,
  -   var(--rh-color-green-60, #3d7317));
  + color: var(--rh-color-status-success-on-light,
  +  var(--rh-color-green-60, #3d7317));
  ```
