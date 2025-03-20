---
"@rhds/tokens": major
---
**Colors**: deprecated `--rh-color-surface-dark-alt`.

In order to simplify the surface tokens, we've deprecated the 
`--rh-color-surface-dark-alt` token. While it still exists, it now refers to a color 
transformation in the OKLAB color space. If you wrote a [custom 
theme](https://ux.redhat.com/theming/customizing/) that sets a value for 
`--rh-color-surface-dark-alt`, you may not need to make any changes, as the value for `--rh-color-surface-dark`
will be used to computed the new value.

```diff
  .my-theme {
    --rh-color-surface-dark: #224242;
-   --rh-color-surface-dark-alt: #113132;
  }
```

When authoring components that use `--rh-color-surface-dark-alt`,
replace that token with the color transform function.

```diff
  :host {
-    background: var(--rh-color-surface-dark-alt);
+    background: oklch(from var(--rh-color-surface-dark) calc(l * 0.82) c h);
  }
```

