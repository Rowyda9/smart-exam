import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://smart-exam.net',
  output: 'static',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'never' },
  vite: { build: { sourcemap: false } },
});
