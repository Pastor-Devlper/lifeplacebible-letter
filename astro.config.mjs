// @ts-check
import { defineConfig } from 'astro/config';

import preact from "@astrojs/preact";
import { remarkImageFigure } from './src/plugins/remark-image-figure.mjs';

// https://astro.build/config
export default defineConfig({
  site: "https://lifeplaceletters.netlify.app",
  integrations: [preact()],
  markdown: {
    remarkPlugins: [remarkImageFigure]
  }
});