// @ts-check
import {defineConfig} from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import {remarkReadingTime} from './plugins/remark-reading-time.mjs';

export default defineConfig({
  site: 'https://arthur.malumian.dev',
  redirects: {
    '/about/': '/',
  },
  prefetch: true,
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/blog/page/'),
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'catppuccin-latte',
        dark: 'catppuccin-mocha',
      },
    },
    remarkPlugins: [remarkReadingTime],
  },
  devToolbar: {
    enabled: false,
  },
});
