import { defineConfig } from 'vite'

export default defineConfig({
  base: '/play/rungame-sample/',
  // Cloudflare Workers Static Assetsはパス付きルート(ankardo.com/play/rungame-sample/*)の場合、
  // アセットのディレクトリ構造がそのパスと同じ階層にネストされていることを要求する
  build: { outDir: 'out/play/rungame-sample' },
  server: {
    port: 3000,
  },
})
