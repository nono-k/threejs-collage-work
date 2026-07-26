// @ts-check

import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import { defineConfig } from 'astro/config';
import glsl from 'vite-plugin-glsl';
import { siteConfig } from './src/config';

const { siteUrl, siteBase } = siteConfig;

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  base: siteBase,
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/styles/mixin.scss";',
        },
      },
    },
    plugins: [glsl()],
  },
  integrations: [mdx()],
});
