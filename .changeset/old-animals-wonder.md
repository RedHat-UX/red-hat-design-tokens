---
"@rhds/tokens": minor
---
**Editors**: Added support for the neovim plugin [nvim-colorizer](), which displays colors next to their values or names.

With this configuration (for lazy.nvim), you'll see a color swatch in your editor next to rhds variable names

```lua
return {"catgoose/nvim-colorizer.lua",
    event = "BufReadPre",
    opts = { -- set to setup table
    user_default_options = {
      mode = 'virtualtext',
      names_custom = function()
        -- set this to your local machine's path
        local json_path = '~/Developer/redhat-ux/red-hat-design-tokens/editor/neovim/nvim-colorizer.json'
        local handle = assert(io.open(vim.fn.expand(json_path), 'r'))
        local content = handle:read('*a')
              handle:close()
        local colors = vim.json.decode(content)
        return colors
      end,
    }
  },
}
```
