---
title: I Switched to LazyVim
date: 2025-07-30
---

In this post, I’ll explain why I switched from my own Neovim configuration to [LazyVim](https://www.lazyvim.org).

Recently, I rewrote my website from Jekyll to Astro. The reason was simple: I don’t know Ruby and don’t want to learn it. Astro is a JavaScript framework, and JavaScript is my main programming language. Plus, Astro offers great SEO optimizations. So, I decided to switch.

That got me thinking: if I’m already changing the tech behind my blog, maybe it’s time to rethink my dev setup too. That’s when I decided to give LazyVim a try.

There were three main reasons:

**1. I was tired of configuring my own setup.**

My biggest problem with configuring tools is that I never stop. If something can be customized, I’ll keep tweaking it forever. LazyVim saves me from that. My current config is mostly just this:

```lua
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not (vim.uv or vim.loop).fs_stat(lazypath) then
  local lazyrepo = "https://github.com/folke/lazy.nvim.git"
  local out = vim.fn.system({ "git", "clone", "--filter=blob:none", "--branch=stable", lazyrepo, lazypath })
  if vim.v.shell_error ~= 0 then
    vim.api.nvim_echo({
      { "Failed to clone lazy.nvim:\n", "ErrorMsg" },
      { out, "WarningMsg" },
      { "\nPress any key to exit..." },
    }, true, {})
    vim.fn.getchar()
    os.exit(1)
  end
end
vim.opt.rtp:prepend(lazypath)

require("lazy").setup({
  spec = {
    { "LazyVim/LazyVim", import = "lazyvim.plugins" },

    { import = "lazyvim.plugins.extras.lang.typescript" },
    { import = "lazyvim.plugins.extras.lang.astro" },
    { import = "lazyvim.plugins.extras.lang.git" },
    { import = "lazyvim.plugins.extras.lang.json" },
    { import = "lazyvim.plugins.extras.lang.yaml" },
    { import = "lazyvim.plugins.extras.lang.markdown" },
    { import = "lazyvim.plugins.extras.linting.eslint" },
    { import = "lazyvim.plugins.extras.formatting.prettier" },
    { import = "lazyvim.plugins.extras.coding.mini-surround" },
    { import = "lazyvim.plugins.extras.editor.harpoon2" },

    { import = "plugins" },
    { import = "plugins.ui" },
    { import = "plugins.editor" },
    { import = "plugins.ai" },
  },
  defaults = {
    lazy = false,
    version = false,
  },
  install = { colorscheme = { "tokyonight", "habamax" } },
  checker = {
    enabled = true,
    notify = false,
  },
  performance = {
    rtp = {
      disabled_plugins = {
        "gzip",
        "tarPlugin",
        "tohtml",
        "tutor",
        "zipPlugin",
        },
    },
  },
})
```

**2. It’s simple.**

This follows from the first. The ease of setup is refreshing. I configure once and don’t worry if my config is good enough. Adding extra plugins via `lazyvim.plugins.extras` is a wonderful experience.

**3. I like the defaults.**

LazyVim comes with a solid set of plugins, keymaps, and sane defaults. It covers 95% of what I need out of the box. And if I want to change something, it’s easy. For example, I disable plugins I don’t use:

```lua
return {
  { "folke/noice.nvim", enabled = false },
  {
    "akinsho/bufferline.nvim",
    enabled = false,
  },
  {
    "echasnovski/mini.pairs",
    enabled = false,
  },
}
```

Add my favorite `keymaps.lua`:

```lua
-- Stay in the middle during jumps
vim.keymap.set("n", "<C-d>", "<C-d>zz")
vim.keymap.set("n", "<C-u>", "<C-u>zz")

-- Stay in the middle while searching
vim.keymap.set("n", "n", "nzzzv")
vim.keymap.set("n", "N", "Nzzzv")

-- Move selected lines
vim.keymap.set("v", "J", ":m '>+1<CR>gv=gv")
vim.keymap.set("v", "K", ":m '<-2<CR>gv=gv")

-- Paste without yanking
vim.keymap.set("x", "<leader>P", [["_dP]], { desc = "Paste (BH)" })

-- Delete without yanking
vim.keymap.set({ "n", "v" }, "<leader>D", [["_d]], { desc = "Delete (BH)" })
```

And tweak `options.lua`:

```lua
vim.g.autoformat = false
vim.g.snacks_animate = false

vim.opt.shell = 'zsh'
vim.opt.guicursor = ''
vim.opt.mouse = ''
vim.opt.spell = true
vim.opt.spelllang = { 'en_us', 'ru' }
```

I have small customizations for a few plugins, like my favorite plugin, [hapoon2](https://github.com/ThePrimeagen/harpoon) by ThePrimeagen. That’s it.

Now, I can say I no longer think about my config. I do what I love — programming. Check out my [dotfiles](https://github.com/amalumian/dotfiles).
