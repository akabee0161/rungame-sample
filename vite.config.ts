import { defineConfig } from 'vite'

export default defineConfig({
  base: '/labs/games/rungame/',
  build: { outDir: 'out' },
  server: {
    port: 3000,
  },
})
