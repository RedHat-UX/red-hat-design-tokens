---
"@rhds/tokens": major
---

- Added language specific font-family tokens. Example: `--rh-font-family-lang-he: 'Noto Sans Hebrew';`
- Removes language fonts from `--rh-font-family-body-text` and `--rh-font-family-heading`

Before:
```
body {
  font-family: var(--rh-font-family-body-text, RedHatText, "Red Hat Text", "Noto Sans Arabic", "Noto Sans Hebrew", "Noto Sans JP", "Noto Sans KR", "Noto Sans Malayalam", "Noto Sans SC", "Noto Sans TC", "Noto Sans Thai", Helvetica, Arial, sans-serif);
}

:is(h1,h2,h3,h4,h5,h6) {
  font-family: var(--rh-font-family-heading, RedHatDisplay, "Red Hat Display", "Noto Sans Arabic", "Noto Sans Hebrew", "Noto Sans JP", "Noto Sans KR", "Noto Sans Malayalam", "Noto Sans SC", "Noto Sans TC", "Noto Sans Thai", Helvetica, Arial, sans-serif);
}
```

After:
```
body {
  font-family: var(--rh-font-family-body-text, RedHatText, "Red Hat Text");
}

:is(h1,h2,h3,h4,h5,h6) {
  font-family: var(--rh-font-family-heading, RedHatDisplay, "Red Hat Display");
}

[lang="he"] {
  font-family: var(--rh-font-family-lang-he: "Noto Sans Hebrew");
}

[lang="zh-CN"] {
  font-family: var(--rh-font-family-lang-zh-cn: 'Noto Sans SC');
}
```
