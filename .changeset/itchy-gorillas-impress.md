---
"@rhds/tokens": major
---

Changed `black` crayon tokens to `gray` crayon tokens. This reflects the new 
color palette. This also required updates to the `gray` crayon token names and 
changes to semantic token values that use grays. **Note** that the new 
`--rh-color-grey-*` tokens do not line up with the old `--rh-color-black-*` 
tokens, so be sure to enact contrast testing on all your uses.

| Before                 | After                |
| ---------------------- | -------------------- |
| `--rh-color-black-150` | `--rh-color-gray-05` |
| `--rh-color-black-200` | `--rh-color-gray-20` |
| `--rh-color-black-300` | `--rh-color-gray-30` |
| `--rh-color-black-400` | `--rh-color-gray-40` |
| `--rh-color-black-500` | `--rh-color-gray-50` |
| `--rh-color-black-600` | `--rh-color-gray-60` |
| `--rh-color-black-700` | `--rh-color-gray-70` |
| `--rh-color-black-800` | `--rh-color-gray-80` |
| `--rh-color-black-900` | `--rh-color-gray-90` |
