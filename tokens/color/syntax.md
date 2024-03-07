<label>
  <input type="checkbox"
         name="dark-syntax"
         autocomplete="off"
         onchange="this.closest('div').classList.toggle('dark')">
  On Dark
</label>

<rh-tabs>
<rh-tab>HTML</rh-tab>
<rh-tab-panel>

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>HTML</title>
    <link rel="stylesheet" href="/styles.css">

    <style>body {width: 500px;}</style>
    
    <script type="application/javascript">
      function $init() {return true;}
    </script>
  </head>
  <body>
    <header>
      <h1>Tags</h1>
    </header>
    <main>
      <p checked class="title" id='title'><!-- main content here --></p>
    </main>
  </body>
</html>
```

</rh-tab-panel>

<rh-tab>CSS</rh-tab>
<rh-tab-panel>

```css
@import url(print.css);

@font-face {
  font-family: Chunkfive;
  src: url('Chunkfive.otf');
}

body, .usertext {
  color: #F0F0F0;
  background: #600;
  font-family: Chunkfive, sans;
  --heading-1: 30px/32px Helvetica, sans-serif;
}

@import url(print.css);
@media print {
  a[href^=http]::after {
    content: attr(href)
  }
}
```

<rh-tab>Less</rh-tab>
<rh-tab-panel>

```less
@import “fruits”; 

@rhythm: 1.5em; 

@media screen and (min-resolution: 2dppx) { 
  body {font-size: 125%} 
} 

section > .foo + #bar:hover [href*=“less”] { 
  margin: @rhythm 0 0 @rhythm; 
  padding: calc(5% + 20px); 
  background: #f00ba7 url(http://placehold.alpha-centauri/42.png) no-repeat; 
  background-image: linear-gradient(-135deg, wheat, fuchsia) !important; 
  background-blend-mode: multiply; 
} 

@font-face { 
  font-family: /* ? */ ‘Omega’; 
  src: url(‘../fonts/omega-webfont.woff?v=2.0.2’); 
} 

.icon-baz::before { 
  display: inline-block; 
  font-family: “Omega”, Alpha, sans-serif; 
  content: “\f085”; 
  color: rgba(98, 76 /* or 54 */, 231, .75); 
}
```

</rh-tab-panel>

<rh-tab>TypeScript</rh-tab>
<rh-tab-panel>

```typescript
@customElement('rh-jazz-hands')
export class RhJazzHands extends LitElement {
  public static myValue: string;

  @colorContextConsumer() private on: ColorTheme = 'light';

  constructor(init: string) {
    this.myValue = init;
  }

  render() {
    const  { on } = this;
    return html`
      <slot id="container" class="${classMap({ [on]: !!on })}"></slot>
    `;
  }
}
```

</rh-tab-panel>

<rh-tab>Bash</rh-tab>
<rh-tab-panel>

```bash
#!/bin/bash

###### CONFIG
ACCEPTED_HOSTS="/root/.hag_accepted.conf"
BE_VERBOSE=false

if [ "$UID" -ne 0 ]
then
  echo "Superuser rights required"
  exit 2
fi

genApacheConf(){
  echo -e "# Host ${HOME_DIR}$1/$2 :"
}

echo '"quoted"' | tr -d \" > text.txt
```

</rh-tab-panel>

<rh-tab>Go</rh-tab>
<rh-tab-panel>

```go
package main

import "fmt"

func main() {
  fmt.Println("Hello, 世界")
}
```

</rh-tab-panel>

<rh-tab>Rust</rh-tab>
<rh-tab-panel>

```rust
trait Animal {
    // Associated function signature; `Self` refers to the implementor type.
    fn new(name: &'static str) -> Self;

    // Method signatures; these will return a string.
    fn name(&self) -> &'static str;
    fn noise(&self) -> &'static str;

    // Traits can provide default method definitions.
    fn talk(&self) {
        println!("{} says {}", self.name(), self.noise());
    }
}
```

</rh-tab-panel>

<rh-tab>JSON</rh-tab>
<rh-tab-panel>

```json
[
  {
    "title": "apples",
    "count": [
      12000,
      20000
    ],
    "description": {
      "text": "...",
      "sensitive": false
    }
  },
  {
    "title": "oranges",
    "count": [
      17500,
      null
    ],
    "description": {
      "text": "...",
      "sensitive": false
    }
  }
]
```

</rh-tabs>
