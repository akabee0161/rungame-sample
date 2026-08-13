import { defineConfig } from 'vite'

export default defineConfig({
  base: '/play/rungame-sample/',
  build: { outDir: 'out' },
  server: {
    port: 3000,
  },
})
