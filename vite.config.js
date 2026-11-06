import { defineConfig } from 'vite'

export default defineConfig({
  // Относительные пути к ресурсам: сборка работает и на GitHub Pages
  // (https://<user>.github.io/<repo>/), и на любом другом статическом хостинге.
  base: './',
})
