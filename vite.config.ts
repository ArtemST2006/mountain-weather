import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Относительные пути к ресурсам: сборка работает и на GitHub Pages
  // (https://<user>.github.io/<repo>/), и на любом другом статическом хостинге.
  base: './',
  css: {
    modules: {
      // Читаемые имена классов в разработке: Card_title__a1b2c
      generateScopedName: '[name]_[local]__[hash:base64:5]',
    },
  },
})
