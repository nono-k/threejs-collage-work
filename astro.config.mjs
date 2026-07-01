// @ts-check

import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { siteConfig } from './src/config';

const { siteUrl } = siteConfig;

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
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
  },
});
