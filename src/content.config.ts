// Content is sourced from TinaCMS (see src/lib/data.ts), not Astro's content layer.
// Declaring the folder as JSON stops Astro auto-generating a Markdown collection for it.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const landing = defineCollection({ loader: glob({ pattern: '**/*.json', base: 'src/content/landing' }) });
export const collections = { landing };
