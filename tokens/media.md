For use in templating systems and JavaScript modules. We recommend against 
importing tokens
directly into components. These are directly derived from [breakpoints](#breakpoints).

```html
<link rel="stylesheet"
      href="large-screen.css"
      media="{{ tokens.get('--rh-media-lg') }}"
```
