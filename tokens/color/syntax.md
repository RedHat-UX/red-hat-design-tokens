```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>HTML</title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <header>
      <h1>Tags</h1>
    </header>
    <main>
      <p class="class-name">Text</p>
    </main>
  </body>
</html>
```

```typescript
@customElement('rh-jazz-hands')
export class RhJazzHands extends LitElement {
  @colorContextConsumer() private on: ColorTheme = 'light';

  render() {
    const  { on } = this;
    return html`
      <slot id="container" class=${classMap({ [on]: !!on })></slot>
    `;
  }
}
```

```css
@container (--context: dark) {
  :host(:has(rh-cta)) {
    border-color: var(--rh-color-border-interactive-on-dark, #73bcf7);
  }
}
```

```bash
# !/bin/bash

source_prefix=$1
suffix=$2
destination_prefix=$3

for i in $(ls ${source_prefix}*.${suffix});do
  mv $i $(echo $i | sed s/${source_prefix}/${destination_prefix}/)
done
```

```go
package main

import "fmt"

func main() {
  fmt.Println("Hello, 世界")
}
```

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

```json
{
  "color": {
    "$type": "color",
    "accent": {
      "base": {
        "on-light": {
          "$name": "rh-color-accent-base-on-light",
          "$description": "Inline link (light theme)",
          "$value": "#0066cc"
        }
      }
    }
  }
}
```

