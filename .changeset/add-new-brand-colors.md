---
"@rhds/tokens": major
---

# Crayon color updates

Crayon color token names and values were changed to match the [new Red Hat color palette](https://www.redhat.com/en/about/brand/standards/color).

To help you make these changes, use the [RHDS Stylelint Plugin](https://github.com/RedHat-UX/red-hat-design-tokens/tree/main/plugins/stylelint).If you'd like more information about Stylelint, visit [stylelint.io](http://stylelint.io/).

Stylelint's migration rule can take a dictionary of names to migrate, and if it finds one of the specified names, it will automatically replace it with the new one. The rules below indicate how color tokens in 1.0 map to those in 2.0 and can be copied and pasted into your own repo. 

```yaml
rules:
  rhds/token-values:
    - true
    - migrations:
      # reds
      --rh-color-red-50: --rh-color-red-10
      --rh-color-red-100: --rh-color-red-20
      --rh-color-red-200: --rh-color-red-30
      --rh-color-red-300: --rh-color-red-40
      --rh-color-red-400: --rh-color-red-50
      --rh-color-red-500: --rh-color-red-50
      --rh-color-red-600: --rh-color-red-60
      --rh-color-red-700: --rh-color-red 60
      --rh-color-red-800: --rh-color-red-70
      # oranges
      --rh-color-orange-50: --rh-color-orange-10
      --rh-color-orange-100: --rh-color-orange-30
      --rh-color-orange-300: --rh-color-orange-40
      --rh-color-orange-500: --rh-color-orange-60
      --rh-color-orange-700: --rh-color-orange-70
      # yellows (previously golds)
      --rh-color-gold-50: --rh-color-yellow-10
      --rh-color-gold-400: --rh-color-yellow-40
      --rh-color-gold-600: --rh-color-yellow-70
      # greens
      --rh-color-green-50: --rh-color-green-10
      --rh-color-green-100: --rh-color-green-20
      --rh-color-green-500: --rh-color-green-60
      --rh-color-green-600: --rh-color-green-70
      # teals (previously cyans)
      --rh-color-cyan-50: --rh-color-teal-10
      --rh-color-cyan-100: --rh-color-teal-30
      --rh-color-cyan-300: --rh-color-teal-50
      --rh-color-cyan-400: --rh-color-teal-60
      --rh-color-cyan-500: --rh-color-teal-70
      # blues
      --rh-color-blue-50: --rh-color-blue-10
      --rh-color-blue-100: --rh-color-blue-20
      --rh-color-blue-200: --rh-color-blue-30
      --rh-color-blue-250: --rh-color-blue-40
      --rh-color-blue-400: --rh-color-blue-50
      --rh-color-blue-500: --rh-color-blue-60
      --rh-color-blue-600: --rh-color-blue-70
      # purples
      --rh-color-purple-50: --rh-color-purple-10
      --rh-color-purple-100: --rh-color-purple-20
      --rh-color-purple-300: --rh-color-purple-40
      --rh-color-purple-500: --rh-color-purple-60
      --rh-color-purple-700: --rh-color-purple-70
      # grays
      --rh-color-gray-05: --rh-color-gray-10
      --rh-color-gray-10: --rh-color-gray-20
      --rh-color-gray-20: --rh-color-gray-30
      --rh-color-gray-30: --rh-color-gray-40
      --rh-color-gray-40: --rh-color-gray-50
      --rh-color-gray-50: --rh-color-gray-60
      --rh-color-gray-60: --rh-color-gray-70
      --rh-color-gray-70: --rh-color-gray-80
      --rh-color-gray-80: --rh-color-gray-90
      --rh-color-gray-90: --rh-color-gray-95
      --rh-color-black: --rh-color-gray-100
```

There are several new crayon color tokens that have been added and do not directly map to a 1.0 token. These include:

- `--rh-color-red-orange-10`
- `--rh-color-red-orange-20`
- `--rh-color-red-orange-30`
- `--rh-color-red-orange-40`
- `--rh-color-red-orange-50`

- `--rh-color-orange-20`
- `--rh-color-orange-50`

- `--rh-color-yellow-20`
- `--rh-color-yellow-30`
- `--rh-color-yellow-50`
- `--rh-color-yellow-60`

- `--rh-color-green-30`
- `--rh-color-green-40`
- `--rh-color-green-50`

- `--rh-color-teal-20`
- `--rh-color-teal-40`
 
- `--rh-color-purple-30`
- `--rh-color-purple-50`



## Semantic token value changes

The following semantic token values changed, but the token names did not. In many cases, you may automatically migrate these tokens using the `rhds/token-values` stylelint rule.

~~~yaml
rules:
  rhds/token-values: true
~~~

### Accent

| Semantic token          | Old crayon token value | New crayon token value |
| ----------------------- | ---------------------- | ---------------------- |
| `accent-base-on-light`  | `blue-400`             | `blue-50`              |
| `accent-base-on-dark`   | `blue-200`             | `blue-30`              |
| `accent-brand-on-light` | `red-500`              | `brand-red-on-light`   |
| `accent-brand-on-dark`  | `red-400`              | `brand-red-on-dark`    |

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
