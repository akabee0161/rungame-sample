# Phaser スプライトアニメーション テスト 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Vite + TypeScript + Phaser 3 で、スプライトシートを使ったキャラクターアニメーション（idle / 歩行左右）をキー入力で切り替えるデモを作る。

**Architecture:** Boot → Preload → Game の3シーン構成。Preload シーンでアセットを読み込み、Game シーンでスプライトの表示・アニメーション定義・キー入力処理を行う。シーン間は `this.scene.start()` で遷移する。

**Tech Stack:** Vite 6, TypeScript 5, Phaser 3（最新安定版）, Vitest（ユニットテスト）

---

## ファイルマップ

| ファイル | 役割 |
|---------|------|
| `index.html` | エントリーポイント HTML |
| `vite.config.ts` | Vite 設定（base パス） |
| `src/main.ts` | `Phaser.Game` インスタンス生成・シーン登録 |
| `src/scenes/Boot.ts` | 設定確認後 Preload へ遷移 |
| `src/scenes/Preload.ts` | アセット読み込み・ローディングバー表示 |
| `src/scenes/Game.ts` | スプライト表示・アニメーション・キー入力 |
| `src/constants.ts` | シーンキー・アニメーション名などの定数 |
| `public/assets/dude.png` | スプライトシート（32×48px × 9フレーム） |
| `src/__tests__/constants.test.ts` | 定数の型・値ユニットテスト |
| `src/__tests__/animConfig.test.ts` | アニメーション設定オブジェクトのテスト |

---

## Task 1: プロジェクトスキャフォールド

**Files:**
- Modify: `index.html`
- Create: `vite.config.ts`
- Create: `src/main.ts`（スケルトン）

- [ ] **Step 1: Vite + TypeScript プロジェクト生成**

```bash
cd /home/akabee/development/phaser-sprite-test
npm create vite@latest . -- --template vanilla-ts
```

プロンプトが出たら `y` で上書き確認を承認する。

- [ ] **Step 2: Phaser 3 と Vitest をインストール**

```bash
npm install phaser
npm install --save-dev vitest @vitest/ui
```

- [ ] **Step 3: 不要なデフォルトファイルを削除**

```bash
rm -f src/counter.ts src/typescript.svg public/vite.svg
```

- [ ] **Step 4: `index.html` を書き換え**

`index.html` を以下の内容に置き換える：

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Phaser Sprite Test</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { background: #000; display: flex; justify-content: center; align-items: center; height: 100vh; }
    </style>
  </head>
  <body>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 5: `vite.config.ts` を作成**

```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  server: {
    port: 3000,
  },
})
```

- [ ] **Step 6: `package.json` の `scripts` に vitest を追加**

`package.json` の `"scripts"` セクションに以下を追加（`"dev"` の後）：

```json
"test": "vitest run",
"test:ui": "vitest --ui"
```

- [ ] **Step 7: コミット**

```bash
git add package.json package-lock.json index.html vite.config.ts
git commit -m "chore: scaffold Vite + TypeScript + Phaser project"
```

---

## Task 2: 定数定義とユニットテスト

**Files:**
- Create: `src/constants.ts`
- Create: `src/__tests__/constants.test.ts`

- [ ] **Step 1: テストファイルを先に作成（TDD）**

`src/__tests__/constants.test.ts` を作成：

```typescript
import { describe, it, expect } from 'vitest'
import { SCENE_KEYS, ANIM_KEYS, ASSET_KEYS } from '../constants'

describe('SCENE_KEYS', () => {
  it('should define Boot key', () => {
    expect(SCENE_KEYS.BOOT).toBe('Boot')
  })
  it('should define Preload key', () => {
    expect(SCENE_KEYS.PRELOAD).toBe('Preload')
  })
  it('should define Game key', () => {
    expect(SCENE_KEYS.GAME).toBe('Game')
  })
})

describe('ANIM_KEYS', () => {
  it('should define idle animation key', () => {
    expect(ANIM_KEYS.IDLE).toBe('idle')
  })
  it('should define walk_left animation key', () => {
    expect(ANIM_KEYS.WALK_LEFT).toBe('walk_left')
  })
  it('should define walk_right animation key', () => {
    expect(ANIM_KEYS.WALK_RIGHT).toBe('walk_right')
  })
})

describe('ASSET_KEYS', () => {
  it('should define dude sprite key', () => {
    expect(ASSET_KEYS.DUDE).toBe('dude')
  })
})
```

- [ ] **Step 2: テストが失敗することを確認**

```bash
npm test
```

期待出力: `FAIL — Cannot find module '../constants'`

- [ ] **Step 3: `src/constants.ts` を実装**

```typescript
export const SCENE_KEYS = {
  BOOT: 'Boot',
  PRELOAD: 'Preload',
  GAME: 'Game',
} as const

export const ANIM_KEYS = {
  IDLE: 'idle',
  WALK_LEFT: 'walk_left',
  WALK_RIGHT: 'walk_right',
} as const

export const ASSET_KEYS = {
  DUDE: 'dude',
} as const
```

- [ ] **Step 4: テストが通ることを確認**

```bash
npm test
```

期待出力: `PASS — 7 tests passed`

- [ ] **Step 5: コミット**

```bash
git add src/constants.ts src/__tests__/constants.test.ts
git commit -m "feat: add scene/animation/asset key constants with tests"
```

---

## Task 3: アニメーション設定オブジェクトとテスト

**Files:**
- Create: `src/animConfigs.ts`
- Create: `src/__tests__/animConfig.test.ts`

- [ ] **Step 1: テストファイルを先に作成（TDD）**

`src/__tests__/animConfig.test.ts` を作成：

```typescript
import { describe, it, expect } from 'vitest'
import { buildAnimConfigs } from '../animConfigs'
import { ANIM_KEYS, ASSET_KEYS } from '../constants'

describe('buildAnimConfigs', () => {
  const configs = buildAnimConfigs()

  it('should return 3 animation configs', () => {
    expect(configs).toHaveLength(3)
  })

  it('idle config should use frame 4 only', () => {
    const idle = configs.find(c => c.key === ANIM_KEYS.IDLE)
    expect(idle).toBeDefined()
    expect(idle!.frames).toEqual({ start: 4, end: 4 })
    expect(idle!.repeat).toBe(-1)
  })

  it('walk_left config should use frames 0-3', () => {
    const walkLeft = configs.find(c => c.key === ANIM_KEYS.WALK_LEFT)
    expect(walkLeft).toBeDefined()
    expect(walkLeft!.frames).toEqual({ start: 0, end: 3 })
    expect(walkLeft!.frameRate).toBe(10)
    expect(walkLeft!.repeat).toBe(-1)
  })

  it('walk_right config should use frames 5-8', () => {
    const walkRight = configs.find(c => c.key === ANIM_KEYS.WALK_RIGHT)
    expect(walkRight).toBeDefined()
    expect(walkRight!.frames).toEqual({ start: 5, end: 8 })
    expect(walkRight!.frameRate).toBe(10)
    expect(walkRight!.repeat).toBe(-1)
  })

  it('all configs should reference dude asset', () => {
    configs.forEach(c => {
      expect(c.assetKey).toBe(ASSET_KEYS.DUDE)
    })
  })
})
```

- [ ] **Step 2: テストが失敗することを確認**

```bash
npm test
```

期待出力: `FAIL — Cannot find module '../animConfigs'`

- [ ] **Step 3: `src/animConfigs.ts` を実装**

```typescript
import { ANIM_KEYS, ASSET_KEYS } from './constants'

export type AnimConfig = {
  key: string
  assetKey: string
  frames: { start: number; end: number }
  frameRate: number
  repeat: number
}

export function buildAnimConfigs(): AnimConfig[] {
  return [
    {
      key: ANIM_KEYS.IDLE,
      assetKey: ASSET_KEYS.DUDE,
      frames: { start: 4, end: 4 },
      frameRate: 1,
      repeat: -1,
    },
    {
      key: ANIM_KEYS.WALK_LEFT,
      assetKey: ASSET_KEYS.DUDE,
      frames: { start: 0, end: 3 },
      frameRate: 10,
      repeat: -1,
    },
    {
      key: ANIM_KEYS.WALK_RIGHT,
      assetKey: ASSET_KEYS.DUDE,
      frames: { start: 5, end: 8 },
      frameRate: 10,
      repeat: -1,
    },
  ]
}
```

- [ ] **Step 4: テストが通ることを確認**

```bash
npm test
```

期待出力: `PASS — 12 tests passed`

- [ ] **Step 5: コミット**

```bash
git add src/animConfigs.ts src/__tests__/animConfig.test.ts
git commit -m "feat: add animation config builder with tests"
```

---

## Task 4: Phaser エントリーポイントとシーン登録

**Files:**
- Create: `src/main.ts`
- Create: `src/scenes/Boot.ts`

- [ ] **Step 1: `src/scenes/Boot.ts` を作成**

```typescript
import Phaser from 'phaser'
import { SCENE_KEYS } from '../constants'

export class Boot extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.BOOT })
  }

  create(): void {
    this.scene.start(SCENE_KEYS.PRELOAD)
  }
}
```

- [ ] **Step 2: `src/main.ts` を作成（シーンは Boot のみ仮登録）**

```typescript
import Phaser from 'phaser'
import { Boot } from './scenes/Boot'
import { SCENE_KEYS } from './constants'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  backgroundColor: '#1a1a2e',
  scene: [Boot],
}

new Phaser.Game(config)
```

- [ ] **Step 3: dev server を起動して黒画面が出ることを確認**

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開き、黒い画面が表示されれば OK（Preload シーンが未実装のためエラーが出るが、Phaser が起動していることを確認）。

- [ ] **Step 4: コミット**

```bash
git add src/main.ts src/scenes/Boot.ts
git commit -m "feat: add Phaser game entry point and Boot scene"
```

---

## Task 5: アセット取得と Preload シーン

**Files:**
- Create: `public/assets/dude.png`
- Create: `src/scenes/Preload.ts`

- [ ] **Step 1: スプライトシートをダウンロード**

```bash
mkdir -p public/assets
curl -o public/assets/dude.png "https://labs.phaser.io/assets/sprites/dude.png"
```

ダウンロード後、`public/assets/dude.png` が存在することを確認：

```bash
ls -lh public/assets/dude.png
```

期待出力: ファイルサイズが 0 より大きい（約 3KB）

- [ ] **Step 2: `src/scenes/Preload.ts` を作成**

```typescript
import Phaser from 'phaser'
import { SCENE_KEYS, ASSET_KEYS } from '../constants'

export class Preload extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.PRELOAD })
  }

  preload(): void {
    const { width, height } = this.scale

    const progressBar = this.add.graphics()
    const progressBox = this.add.graphics()
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50)

    this.load.on('progress', (value: number) => {
      progressBar.clear()
      progressBar.fillStyle(0x6366f1, 1)
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30)
    })

    this.load.on('complete', () => {
      progressBar.destroy()
      progressBox.destroy()
    })

    this.load.spritesheet(ASSET_KEYS.DUDE, 'assets/dude.png', {
      frameWidth: 32,
      frameHeight: 48,
    })
  }

  create(): void {
    this.scene.start(SCENE_KEYS.GAME)
  }
}
```

- [ ] **Step 3: `src/main.ts` に Preload シーンを追加**

`src/main.ts` の `import` に Preload を追加し、`scene` 配列を更新する：

```typescript
import Phaser from 'phaser'
import { Boot } from './scenes/Boot'
import { Preload } from './scenes/Preload'
import { SCENE_KEYS } from './constants'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  backgroundColor: '#1a1a2e',
  scene: [Boot, Preload],
}

new Phaser.Game(config)
```

- [ ] **Step 4: dev server でローディングバーが表示されることを確認**

`npm run dev` が起動中であれば、ブラウザをリロードする。  
紫色のローディングバーが一瞬表示された後、Game シーンへ遷移しようとする（まだ未実装なのでエラーになる）。ローディングバーが見えれば OK。

- [ ] **Step 5: コミット**

```bash
git add public/assets/dude.png src/scenes/Preload.ts src/main.ts
git commit -m "feat: add Preload scene with spritesheet loading"
```

---

## Task 6: Game シーン — スプライト・アニメーション・キー入力

**Files:**
- Create: `src/scenes/Game.ts`
- Modify: `src/main.ts`（Game シーン登録）

- [ ] **Step 1: `src/scenes/Game.ts` を作成**

```typescript
import Phaser from 'phaser'
import { SCENE_KEYS, ANIM_KEYS, ASSET_KEYS } from '../constants'
import { buildAnimConfigs } from '../animConfigs'

export class Game extends Phaser.Scene {
  private sprite!: Phaser.GameObjects.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super({ key: SCENE_KEYS.GAME })
  }

  create(): void {
    const { width, height } = this.scale

    this.registerAnimations()

    this.sprite = this.add.sprite(width / 2, height / 2, ASSET_KEYS.DUDE)
    this.sprite.setScale(3)
    this.sprite.play(ANIM_KEYS.IDLE)

    this.cursors = this.input.keyboard!.createCursorKeys()

    this.add
      .text(width / 2, height - 30, '← → キーで移動', {
        fontSize: '16px',
        color: '#94a3b8',
      })
      .setOrigin(0.5)
  }

  update(): void {
    const speed = 3

    if (this.cursors.left.isDown) {
      this.sprite.x -= speed
      this.sprite.play(ANIM_KEYS.WALK_LEFT, true)
    } else if (this.cursors.right.isDown) {
      this.sprite.x += speed
      this.sprite.play(ANIM_KEYS.WALK_RIGHT, true)
    } else {
      this.sprite.play(ANIM_KEYS.IDLE, true)
    }
  }

  private registerAnimations(): void {
    buildAnimConfigs().forEach(({ key, assetKey, frames, frameRate, repeat }) => {
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers(assetKey, frames),
        frameRate,
        repeat,
      })
    })
  }
}
```

- [ ] **Step 2: `src/main.ts` に Game シーンを追加**

```typescript
import Phaser from 'phaser'
import { Boot } from './scenes/Boot'
import { Preload } from './scenes/Preload'
import { Game } from './scenes/Game'
import { SCENE_KEYS } from './constants'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  backgroundColor: '#1a1a2e',
  scene: [Boot, Preload, Game],
}

new Phaser.Game(config)
```

- [ ] **Step 3: 動作確認**

ブラウザで `http://localhost:3000` を開き、以下を確認する：

1. ローディングバーが表示された後、ゲーム画面に遷移する
2. キャラクター（dude）が画面中央に表示される
3. `←` キーを押すと左向きに歩行アニメーションで移動する
4. `→` キーを押すと右向きに歩行アニメーションで移動する
5. キーを離すとアイドルアニメーションに戻る
6. 画面下部に「← → キーで移動」のテキストが表示される

- [ ] **Step 4: ユニットテストが引き続き通ることを確認**

```bash
npm test
```

期待出力: `PASS — 12 tests passed`

- [ ] **Step 5: コミット**

```bash
git add src/scenes/Game.ts src/main.ts
git commit -m "feat: add Game scene with sprite animation and keyboard input"
```

---

## Task 7: .gitignore と最終整備

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: `.gitignore` を作成**

```
node_modules/
dist/
.superpowers/
*.local
```

- [ ] **Step 2: 最終テスト確認**

```bash
npm test
```

期待出力: `PASS — 12 tests passed`

- [ ] **Step 3: 最終コミット**

```bash
git add .gitignore
git commit -m "chore: add .gitignore"
```
