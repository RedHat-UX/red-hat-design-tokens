# Contributing
Contributions to Red Hat's design tokens are welcome, and must abide by our [code of conduct](https://github.com/RedHat-UX/red-hat-design-system/blob/main/CODE_OF_CONDUCT.md).

## Getting Started

```sh
npm ci
npm run build
```

You should see something like this output:
```
scss
✔︎ build/scss/_variables.scss

css
✔︎ build/css/global.css
✔︎ build/css/shared.css
```

## Dev Server

To develop tokens against a dev serve, open a terminal and run

```sh
npm run build watch
```

and in another terminal run

```sh
npm run start
```

## Defining Tokens

Tokens are defined in [YAML](https://yaml.org) files, following the [Design Tokens Draft Community Group Report](https://design-tokens.github.io/community-group/format/).

### YAML Notes
YAML strings do not need to be quoted, unless they start with a special character. Therefore, `comment`s should not be quoted, but color values and references should.

```yaml
color:
  brand:
    red:
      value: "{color.red.400}"
      comment: Brand red
      50:
        value: "#faeae8"
        comment: Danger Alert background
      100:
        value: "#fddbdb"
      200:
        value: "#fab6b6"
      300:
        value: "#f56d6d"
      400:
        value: "#ee0000"
      500:
        value: "#be0000"
      600:
        value: "#8f0000"
      700:
        value: "#5f0000"
      lightest:
        value: "{color.red.100}"
        comment: Lightest brand red
      lighter:
        value: "{color.red.200}"
        comment: lighter brand red
      light:
        value: "{color.red.300}"
        comment: Light brand red
      dark:
        value: "{color.red.500}"
        comment: Dark brand red/Brand red hover
      darker:
        value: "{color.red.600}"
        comment: Darker brand red
      darkest:
        value: "{color.red.700}"
        comment: Darkest brand red
```
