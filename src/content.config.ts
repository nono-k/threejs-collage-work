import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const content = defineCollection({
  loader: glob({ pattern: 'src/content/*.mdx' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    order: z.number(),
  }),
});

export const collections = {
  content,
};
