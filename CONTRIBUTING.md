# Contributing
Contributions to Red Hat's design tokens are welcome, and must abide by our [code of conduct](https://github.com/RedHat-UX/red-hat-design-system/blob/main/CODE_OF_CONDUCT.md).

## Getting Started

```sh
npm ci
npm run build
```

<small>

If you receive an error `Package libsecret-1 was not found in the pkg-config search path.` when
running `npm ci`, you may need to install `libsecret` sources. This is necessary to package and
publish VSCode snippets.

Fedora/RHEL:
```sh
sudo dnf install libsecret-devel
```
Debian/Ubuntu:
```sh
sudo apt-get install libsecret-1-dev
```
Arch:
```sh
sudo pacman -S libsecret
```

</small>

You should see something like this output:
```
```css
✔︎ css/global.css
✔︎ css/shared.css
✔︎ css/reset.css.js

scss
✔︎ scss/_variables.scss

json
✔︎ json/rhds.tokens.json

js
✔︎ js/rhds.tokens.js
✔︎ js/tokens.d.ts
✔︎ js/tokens.cjs
✔︎ js/tokens.d.cts

html
✔︎ build/index.html

editor
✔︎ editor/vscode.json
✔︎ editor/hexokinase.json
```

## Dev Server

To build automatically whenever you save inputs or the config file, open a terminal and run

```sh
npm run build watch
```

To develop tokens against a dev server / demo, run the above command, then in a separate terminal run

```sh
npm run start
```

## Defining Tokens

Tokens are defined in [YAML](https://yaml.org) files, following the [Design Tokens Draft Community Group Report](https://design-tokens.github.io/community-group/format/).

### YAML Notes
YAML strings do not need to be quoted, unless they start with a special character. Therefore, `comment`s should not be quoted, but color values and references should.

If a token has both a value _and_ nested tokens, e.g. `rh-color-brand-red` and `rh-color-brand-red-lighter`, then the top-level value must be defined under `_`. This is a workaround, and will likely become unnecessary if any when [style-dictionary adopts the draft community group report on token format](https://github.com/amzn/style-dictionary/issues/643#issuecomment-1143493745).

```yaml
color:
  red:
    # Hex values must be quoted
    50:
      value: "#faeae8"
      # Comments should not be quoted
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

  brand:
    red:
      # parent values must be defined under `_`
      _:
        # value aliases must be quoted
        value: "{color.red.400}"
        comment: Brand red
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
