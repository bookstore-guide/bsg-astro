// @ts-check
import { defineConfig } from 'astro/config';
import aiRobotsTxt from 'astro-ai-robots-txt';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://bookstore.guide',
  integrations: [
    aiRobotsTxt(),
    react()
  ],
  server: { host: true, port: 3000 },

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: node({
    mode: 'standalone'
  }),
  output: 'server'
});
