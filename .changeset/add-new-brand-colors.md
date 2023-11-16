---
"@rhds/tokens": major
---

# Crayon color updates

Crayon color token names and values were changed to match the [new Red Hat color palette](https://www.redhat.com/en/about/brand/standards/color).

To help you make these changes, use the [RHDS Stylelint Plugin](https://github.com/RedHat-UX/red-hat-design-tokens/tree/main/plugins/stylelint). Below is a snippet with a rule to help identify when an old token name is used. If you'd like more information about Stylelint, visit [stylelint.io](http://stylelint.io/).

> This rule can take a dictionary of names to migrate, and if it finds one of the specified names, it will automatically replace it with the new one.

```
rules:
  rhds/no-unknown-token-value:
    - true
    - migrations:
      # instances of black-900 will be replaced with gray-90
      --rh-color-black-900: --rh-color-gray-90
```

---

## Crayon token changes

These tables show how the old token values map to new token values. If there is a blank cell, that means there isn't a directly corresponding token.

### Red

| Old token   | Old value   | New token   | New value   |
| ----------- | ----------- | ----------- | ----------- |
| `red-50`    | `#FAEAE8`   | `red-10`    | `#FCE3E3`   |
| `red-100`   | `#FDDBDB`   |             |             |
| `red-200`   | `#FAB6B6`   | `red-20`    | `#FBC5C5`   |
|             |             | `red-40`    | `#F9A8A8`   |
| `red-300`   | `#F56D6D`   |             | `#F56E6E`   |
| `red-400`   | `#FF442B`   |             |             |
| `red-500`   | `#EE0000`   | `red-50`    | `#EE0000`   |
| `red-600`   | `#BE0000`   |             |             |
| `red-700`   | `#8F0000`   | `red-60`    | `#A60000`   |
| `red-800`   | `#5F0000`   | `red-70`    | `#5F0000`   |

### Red-orange

Red-orange is a new crayon color token group. This color set is reserved for danger or error states only.

| New token       | New value |
| --------------- | --------- |
| `red-orange-10` | `#FFE3D9` |
| `red-orange-20` | `#FBBEA8` |
| `red-orange-30` | `#F89B78` |
| `red-orange-40` | `#F4784A` |
| `red-orange-50` | `#F0561D` |
| `red-orange-60` | `#B1380B` |
| `red-orange-70` | `#731F00` |

### Orange

| Old token    | Old value | New token   | New value |
| ------------ | --------- | ----------- | --------- |
| `orange-50`  | `#FFF6EC` | `orange-10` | `#FFE8CC` |
|              |           | `orange-20` | `#FCCB8F` |
| `orange-100` | `#F4B678` | `orange-30` | `#F8AE54` |
| `orange-300` | `#EC7A08` | `orange-40` | `#F5921B` |
|              |           | `orange-50` | `#CA6C0F` |
| `orange-500` | `#8F4700` | `orange-60` | `#9E4A06` |
|              |           | `orange-70` | `#732E00` |
| `orange-700` | `#3B1F00` |             |           |

### Yellow (previously gold)

| Old token   | Old value | New token   | New value |
| ----------- | --------- | ----------- | --------- |
| `gold-50`   | `#FDF7E7` | `yellow-10` | `#FFF4CC` |
|             |           | `yellow-20` | `#FFE072` |
|             |           | `yellow-30` | `#FFCC17` |
| `gold-400`  | `#F0AB00` | `yellow-40` | `#DCA614` |
|             |           | `yellow-50` | `#B98412` |
|             |           | `yellow-60` | `#96640F` |
| `gold-600`  | `#795600` | `yellow-70` | `#73480B` |

### Green

| Old token   | Old value | New token  | New value |
| ----------- | --------- | ---------- | --------- |
| `green-50`  | `#F3FAF2` | `green-10` | `#E9F7DF` |
| `green-100` | `#BDE5B8` | `green-20` | `#D1F1BB` |
|             |           | `green-30` | `#AFDC8F` |
|             |           | `green-40` | `#87BB62` |
|             |           | `green-50` | `#63993D` |
| `green-500` | `#3E8635` | `green-60` | `#3D7317` |
| `green-600` | `#1E4F18` | `green-70` | `#204D00` |

### Teal (previously cyan)

| Old token | Old value | New token | New value |
| ---------- | --------- | --------- | --------- |
| `cyan-50`  | `#F2F9F9` | `teal-10` | `#DAF2F2` |
|            |           | `teal-20` | `#B9E5E5` |
| `cyan-100` | `#A2D9D9` | `teal-30` | `#9AD8D8` |
|            |           | `teal-40` | `#63BDBD` |
| `cyan-300` | `#009596` | `teal-50` | `#37A3A3` |
|            |           | `teal-60` | `#147878` |
| `cyan-400` | `#005F60` |           |           |
| `cyan-500` | `#003737` | `teal-70` | `#004D4D` |

### Blue

| Old token  | Old value | New token | New value |
| ---------- | --------- | --------- | --------- |
| `blue-50`  | `#E7F1FA` | `blue-10` | `#E0F0FF` |
| `blue-100` | `#BEE1F4` | `blue-20` | `#B9DAFC` |
| `blue-200` | `#73BCF7` | `blue-30` | `#92C5F9` |
| `blue-300` | `#2B9AF3` | `blue-40` | `#4394E5` |
| `blue-400` | `#0066CC` | `blue-50` | `#0066CC` |
| `blue-500` | `#004080` | `blue-60` | `#004D99` |
| `blue-600` | `#002952` | `blue-70` | `#003366` |

### Purple

| Old token    | Old value | New token   | New value |
| ------------ | --------- | ----------- | --------- |
| `purple-50`  | `#F2F0FC` | `purple-10` | `#ECE6FF` |
| `purple-100` | `#CBC1FF` | `purple-20` | `#D0C5F4` |
|              |           | `purple-30` | `#B6A6E9` |
| `purple-300` | `#A18FFF` | `purple-40` | `#876FD4` |
|              |           | `purple-50` | `#5E40BE` |
| `purple-500` | `#6753AC` | `purple-60` | `#3D2785` |
| `purple-700` | `#1F0066` |             |           |
|              |           | `purple-70` | `#21134D` |

### Gray

The gray token names changed, but the values did not.

| Old token | New token  |
| --------- | ---------- |
| `white`   | `white`    |
| `gray-05` | `gray-10`  |
| `gray-10` | `gray-20`  |
| `gray-20` | `gray-30`  |
| `gray-30` | `gray-40`  |
| `gray-40` | `gray-50`  |
| `gray-50` | `gray-60`  |
| `gray-60` | `gray-70`  |
| `gray-70` | `gray-80`  |
| `gray-80` | `gray-90`  |
| `gray-90` | `gray-95`  |
| `black`   | `gray-100` |


## Semantic token value changes

### Accent

| Semantic token          | Old crayon token value | New crayon token value |
| ----------------------- | ---------------------- | ---------------------- |
| `accent-base-on-light`  | `blue-400`               | `blue-50`              |
| `accent-base-on-dark`   | `blue-200`               | `blue-30`              |
| `accent-brand-on-light` | `red-500`                | `brand-red-on-light`   |
| `accent-brand-on-dark`  | `red-400`                | `brand-red-on-dark`    |

### Border

| Semantic token                | Old crayon token value | New crayon token value |
| ----------------------------- | ---------------------- | ---------------------- |
| `border-strong-on-light`      | `gray-90`              | `gray-95`              |
| `border-strong-on-dark`       | `white`                | `white`                |
| `border-subtle-on-light`      | `gray-20`              | `gray-30`              |
| `border-subtle-on-dark`       | `gray-40`              | `gray-50`              |
| `border-interactive-on-light` | `blue-400`             | `blue-50`              |
| `border-interactive-on-dark`  | `blue-200`             | `blue-30`              |

### Brand

| Semantic token       | Old crayon token value | New crayon token value |
| -------------------- | ---------------------- | ---------------------- |
| `brand-red-lightest` | `red-100`              | `red-10`               |
| `brand-red-lighter`  | `red-200`              | `red-20`               |
| `brand-red-light`    | `red-300`              | `red-40`               |
| `brand-red-dark`     | `red-600`              | `red-60`               |
| `brand-red-darker`   | `red-700`              | `red-70`               |
| `brand-red-darkest`  | `red-800`              | `red-70`               |
| `brand-red-on-light` | `red-500`              | `red-50`               |
| `brand-red-on-dark`  | `red-400`              | `red-50`               |

### Canvas

| Semantic token | Old crayon token value | New crayon token value |
| -------------- | ---------------------- | ---------------------- |
| `canvas-white` | `white`                | `white`                |
| `canvas-black` | `gray-90`              | `gray-95`              |

### Icon

| Semantic token            | Old crayon token value | New crayon token value |
| ------------------------- | ---------------------- | ---------------------- |
| `icon-primary-on-light`   | `brand-red-on-light`   | `brand-red-on-light`   |
| `icon-primary-on-dark`    | `brand-red-on-dark`    | `brand-red-on-dark`    |
| `icon-secondary-on-light` | `gray-90`              | `gray-95`              |
| `icon-secondary-on-dark`  | `white`                | `gray-50`              |
| `icon-subtle`             | `gray-40`              | `gray-50`              |
| `icon-subtle-hover`       | `gray-30`              | `gray-40`              |

### Interactive

| Semantic token                | Old crayon token value | New crayon token value |
| ----------------------------- | ---------------------- | ---------------------- |
| `interactive-blue-lightest`   | `blue-100`             | `blue-20`              |
| `interactive-blue-lighter`    | `blue-200`             | `blue-30`              |
| `interactive-blue-darker`     | `blue-400`             | `blue-50`              |
| `interactive-blue-darkest`    | `blue-500`             | `blue-70`              |
| `interactive-purple-lightest` | `purple-100`           | `purple-10`            |
| `interactive-purple-lighter`  | `purple-300`           | `purple-30`            |
| `interactive-purple-darker`   | `purple-500`           | `purple-50`            |
| `interactive-purple-darkest`  | `purple-700`           | `purple-70`            |

### Surface

| Semantic token     | Old crayon token value | New crayon token value |
| ------------------ | ---------------------- | ---------------------- |
| `surface-lightest` | `white`                | `white`                |
| `surface-lighter`  | `gray-05`              | `gray-10`              |
| `surface-light`    | `gray-10`              | `gray-20`              |
| `surface-dark`     | `gray-60`              | `gray-70`              |
| `surface-dark-alt` | `gray-70`              | `gray-80`              |
| `surface-darker`   | `gray-80`              | `gray-90`              |
| `surface-darkest`  | `gray-90`              | `gray-95`              |


### Text

| Semantic token            | Old crayon token value | New crayon token value |
| ------------------------- | ---------------------- | ---------------------- |
| `text-primary-on-light`   | `gray-90`              | `gray-95`              |
| `text-primary-on-dark`    | `white`                | `white`                |
| `text-secondary-on-light` | `gray-50`              | `gray-60`              |
| `text-secondary-on-dark`  | `gray-20`              | `gray-30`              |
| `text-brand-on-light`     | `red-500`              | `brand-red-on-light`   |
| `text-brand-on-dark`      | `red-400`              | `brand-red-on-dark`    |