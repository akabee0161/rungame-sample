# Space Runner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 既存の Phaser スプライトテストを、5〜8歳向け宇宙テーマのエンドレスランナーゲームに作り替える。

**Architecture:** Phaser 3 の Arcade Physics を使いダブルジャンプのみで障害物を避ける。純粋なゲームロジック（スコア・難易度・ジャンプ制御）は Phaser に依存しない utility 関数/クラスに分離して TDD で実装する。外部画像は使わず、すべてのアセットを Graphics API で生成する。

**Tech Stack:** Phaser 3.90, TypeScript, Vite, Vitest, Screen Orientation API

---

## ファイルマップ

| 操作 | ファイル | 役割 |
|------|---------|------|
| 更新 | `package.json` | name を space-runner に変更 |
| 更新 | `index.html` | タイトル・viewport 更新 |
| 更新 | `src/main.ts` | 画面サイズ・物理・スケール設定 |
| **全書き換え** | `src/constants.ts` | 全定数を新仕様に置換 |
| **全書き換え** | `src/__tests__/constants.test.ts` | 新定数に合わせて更新 |
| 削除 | `src/animConfigs.ts` | スプライトシート不要 |
| 削除 | `src/__tests__/animConfig.test.ts` | 対応テスト削除 |
| 更新 | `src/scenes/Preload.ts` | Graphics で全テクスチャ生成 |
| 更新 | `src/scenes/Boot.ts` | 変更なし（Preload へ遷移） |
| 新規 | `src/scenes/Title.ts` | タイトル画面・向きロック |
| **全書き換え** | `src/scenes/Game.ts` | メインゲームプレイ |
| 新規 | `src/scenes/GameOver.ts` | スコア表示・リトライ |
| 新規 | `src/objects/Player.ts` | プレイヤー（物理 + ダブルジャンプ） |
| 新規 | `src/objects/ObstacleGroup.ts` | 障害物スポーンと管理 |
| 新規 | `src/objects/StarCoinGroup.ts` | コインスポーンと管理 |
| 新規 | `src/objects/Background.ts` | 流れる星の背景 |
| 新規 | `src/utils/jumpController.ts` | ジャンプ回数管理（純粋） |
| 新規 | `src/utils/scoreManager.ts` | スコア計算・難易度計算（純粋） |
| 新規 | `src/utils/storage.ts` | ハイスコアの localStorage 保存 |
| 新規 | `src/utils/orientationLock.ts` | Screen Orientation API ラッパー |
| 新規 | `src/__tests__/jumpController.test.ts` | |
| 新規 | `src/__tests__/scoreManager.test.ts` | |
| 新規 | `src/__tests__/storage.test.ts` | |
| 新規 | `src/__tests__/orientationLock.test.ts` | |

---

## Task 1: プロジェクト設定と定数の全置換

**Files:**
- Modify: `package.json`
- Modify: `index.html`
- Modify: `src/main.ts`
- Modify: `src/constants.ts`
- Modify: `src/__tests__/constants.test.ts`
- Delete: `src/animConfigs.ts`
- Delete: `src/__tests__/animConfig.test.ts`

- [ ] **Step 1: constants.ts を全書き換え**

```typescript
// src/constants.ts
export const SCENE_KEYS = {
  BOOT: 'Boot',
  PRELOAD: 'Preload',
  TITLE: 'Title',
  GAME: 'Game',
  GAME_OVER: 'GameOver',
} as const

export const ASSET_KEYS = {
  PLAYER: 'player',
  METEOR: 'meteor',
  UFO: 'ufo',
  ALIEN: 'alien',
  COIN: 'coin',
} as const

export const GAME_WIDTH = 720
export const GAME_HEIGHT = 405
export const GROUND_Y = GAME_HEIGHT - 50     // 355: 地面の上端 Y 座標
export const PLAYER_X = 120
export const PLAYER_RADIUS = 18

export const SCROLL_SPEED = 280              // px/s: 障害物の移動速度
export const JUMP_VELOCITY = -520            // 上方向の初速度
export const GRAVITY = 900                   // 重力加速度 px/s²
export const MAX_JUMPS = 2

export const SCORE_PER_SECOND = 10
export const COIN_SCORE = 50

export const SPAWN_INTERVAL_START = 2500     // ms: 初期スポーン間隔
export const SPAWN_INTERVAL_STEP = 250       // ms: 難易度上昇ごとの短縮量
export const SPAWN_INTERVAL_MIN = 800        // ms: 最小スポーン間隔
export const DIFFICULTY_STEP_MS = 20_000     // 20 秒ごとに難易度アップ

export const COLORS = {
  BG: 0x0a0a2e,
  GROUND: 0x1a1a5e,
  GROUND_LINE: 0x3d85c8,
  PLAYER_BODY: 0x74b9ff,
  PLAYER_VISOR: 0xffeaa7,
  METEOR: 0xe17055,
  METEOR_SHADOW: 0xc0392b,
  UFO_BODY: 0x55efc4,
  UFO_DOME: 0xffeaa7,
  ALIEN: 0xa29bfe,
  ALIEN_EYE: 0xffeaa7,
  COIN: 0xffd700,
  STAR: 0xffffff,
  UI_TEXT: 0xffffff,
  SCORE_TEXT: 0xffd700,
  HI_SCORE_TEXT: 0x74b9ff,
} as const
```

- [ ] **Step 2: constants.test.ts を全書き換え**

```typescript
// src/__tests__/constants.test.ts
import { describe, it, expect } from 'vitest'
import {
  SCENE_KEYS, ASSET_KEYS,
  GAME_WIDTH, GAME_HEIGHT, GROUND_Y,
  SCORE_PER_SECOND, COIN_SCORE,
  SPAWN_INTERVAL_START, SPAWN_INTERVAL_MIN,
  MAX_JUMPS,
} from '../constants'

describe('SCENE_KEYS', () => {
  it('defines all five scenes', () => {
    expect(SCENE_KEYS.BOOT).toBe('Boot')
    expect(SCENE_KEYS.PRELOAD).toBe('Preload')
    expect(SCENE_KEYS.TITLE).toBe('Title')
    expect(SCENE_KEYS.GAME).toBe('Game')
    expect(SCENE_KEYS.GAME_OVER).toBe('GameOver')
  })
})

describe('ASSET_KEYS', () => {
  it('defines all asset keys', () => {
    expect(ASSET_KEYS.PLAYER).toBe('player')
    expect(ASSET_KEYS.METEOR).toBe('meteor')
    expect(ASSET_KEYS.UFO).toBe('ufo')
    expect(ASSET_KEYS.ALIEN).toBe('alien')
    expect(ASSET_KEYS.COIN).toBe('coin')
  })
})

describe('game dimensions', () => {
  it('is 16:9 landscape', () => {
    expect(GAME_WIDTH / GAME_HEIGHT).toBeCloseTo(16 / 9, 1)
  })
  it('GROUND_Y is within screen height', () => {
    expect(GROUND_Y).toBeGreaterThan(0)
    expect(GROUND_Y).toBeLessThan(GAME_HEIGHT)
  })
})

describe('scoring constants', () => {
  it('SCORE_PER_SECOND is positive', () => {
    expect(SCORE_PER_SECOND).toBeGreaterThan(0)
  })
  it('COIN_SCORE is positive', () => {
    expect(COIN_SCORE).toBeGreaterThan(0)
  })
  it('SPAWN_INTERVAL_START is greater than SPAWN_INTERVAL_MIN', () => {
    expect(SPAWN_INTERVAL_START).toBeGreaterThan(SPAWN_INTERVAL_MIN)
  })
})

describe('MAX_JUMPS', () => {
  it('is 2 for double jump', () => {
    expect(MAX_JUMPS).toBe(2)
  })
})
```

- [ ] **Step 3: animConfigs.ts と animConfig.test.ts を削除**

```bash
rm src/animConfigs.ts src/__tests__/animConfig.test.ts
```

- [ ] **Step 4: main.ts を全書き換え**

```typescript
// src/main.ts
import Phaser from 'phaser'
import { Boot } from './scenes/Boot'
import { Preload } from './scenes/Preload'
import { Title } from './scenes/Title'
import { Game } from './scenes/Game'
import { GameOver } from './scenes/GameOver'
import { GAME_WIDTH, GAME_HEIGHT, GRAVITY } from './constants'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#0a0a2e',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: GRAVITY, x: 0 }, debug: false },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Boot, Preload, Title, Game, GameOver],
}

new Phaser.Game(config)
```

- [ ] **Step 5: index.html を更新**

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <title>Space Runner</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { background: #000; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden; touch-action: none; }
    </style>
  </head>
  <body>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 6: package.json の name を更新**

```json
{
  "name": "space-runner",
  ...
}
```

- [ ] **Step 7: テストを実行して constants.test.ts が PASS することを確認**

```bash
npm test
```
期待値: `constants.test.ts` の全テストが PASS。`animConfig.test.ts` は消えているので出ない。

- [ ] **Step 8: コミット**

```bash
git add -A
git commit -m "chore: replace constants and project config for space-runner"
```

---

## Task 2: JumpController ユーティリティ（TDD）

**Files:**
- Create: `src/utils/jumpController.ts`
- Create: `src/__tests__/jumpController.test.ts`

- [ ] **Step 1: テストを書く（RED）**

```typescript
// src/__tests__/jumpController.test.ts
import { describe, it, expect } from 'vitest'
import { JumpController } from '../utils/jumpController'

describe('JumpController', () => {
  it('allows first jump from ground', () => {
    const ctrl = new JumpController(2)
    expect(ctrl.canJump()).toBe(true)
  })

  it('allows second jump in air', () => {
    const ctrl = new JumpController(2)
    ctrl.onJump()
    expect(ctrl.canJump()).toBe(true)
  })

  it('prevents third jump', () => {
    const ctrl = new JumpController(2)
    ctrl.onJump()
    ctrl.onJump()
    expect(ctrl.canJump()).toBe(false)
  })

  it('resets jump count on landing', () => {
    const ctrl = new JumpController(2)
    ctrl.onJump()
    ctrl.onJump()
    ctrl.onLand()
    expect(ctrl.canJump()).toBe(true)
    expect(ctrl.jumpsUsed).toBe(0)
  })

  it('tracks jumps used correctly', () => {
    const ctrl = new JumpController(2)
    expect(ctrl.jumpsUsed).toBe(0)
    ctrl.onJump()
    expect(ctrl.jumpsUsed).toBe(1)
    ctrl.onJump()
    expect(ctrl.jumpsUsed).toBe(2)
  })

  it('respects maxJumps = 1', () => {
    const ctrl = new JumpController(1)
    ctrl.onJump()
    expect(ctrl.canJump()).toBe(false)
  })

  it('onJump does nothing when jumps exhausted', () => {
    const ctrl = new JumpController(2)
    ctrl.onJump()
    ctrl.onJump()
    ctrl.onJump()
    expect(ctrl.jumpsUsed).toBe(2)
  })
})
```

- [ ] **Step 2: テストを実行して FAIL を確認**

```bash
npm test -- jumpController
```
期待値: `Cannot find module '../utils/jumpController'` のエラー

- [ ] **Step 3: 最小実装**

```typescript
// src/utils/jumpController.ts
export class JumpController {
  private count = 0
  readonly maxJumps: number

  constructor(maxJumps = 2) {
    this.maxJumps = maxJumps
  }

  canJump(): boolean {
    return this.count < this.maxJumps
  }

  onJump(): void {
    if (this.canJump()) this.count++
  }

  onLand(): void {
    this.count = 0
  }

  get jumpsUsed(): number {
    return this.count
  }
}
```

- [ ] **Step 4: テストを実行して PASS を確認**

```bash
npm test -- jumpController
```
期待値: 全 7 テスト PASS

- [ ] **Step 5: コミット**

```bash
git add src/utils/jumpController.ts src/__tests__/jumpController.test.ts
git commit -m "feat: add JumpController utility with double-jump support"
```

---

## Task 3: scoreManager ユーティリティ（TDD）

**Files:**
- Create: `src/utils/scoreManager.ts`
- Create: `src/__tests__/scoreManager.test.ts`

- [ ] **Step 1: テストを書く（RED）**

```typescript
// src/__tests__/scoreManager.test.ts
import { describe, it, expect } from 'vitest'
import { calculateScore, getSpawnInterval } from '../utils/scoreManager'

describe('calculateScore', () => {
  it('returns 0 at start', () => {
    expect(calculateScore(0, 0)).toBe(0)
  })

  it('returns 10 per second of survival', () => {
    expect(calculateScore(1000, 0)).toBe(10)
    expect(calculateScore(5000, 0)).toBe(50)
  })

  it('returns 50 per coin collected', () => {
    expect(calculateScore(0, 1)).toBe(50)
    expect(calculateScore(0, 3)).toBe(150)
  })

  it('combines time score and coin score', () => {
    expect(calculateScore(3000, 2)).toBe(30 + 100)
  })

  it('truncates sub-second elapsed time', () => {
    expect(calculateScore(1999, 0)).toBe(10)
    expect(calculateScore(2000, 0)).toBe(20)
  })
})

describe('getSpawnInterval', () => {
  it('returns SPAWN_INTERVAL_START (2500) at time 0', () => {
    expect(getSpawnInterval(0)).toBe(2500)
  })

  it('reduces by 250ms at 20 seconds', () => {
    expect(getSpawnInterval(20_000)).toBe(2250)
  })

  it('reduces by 500ms at 40 seconds', () => {
    expect(getSpawnInterval(40_000)).toBe(2000)
  })

  it('does not go below SPAWN_INTERVAL_MIN (800)', () => {
    expect(getSpawnInterval(1_000_000)).toBe(800)
  })

  it('reaches minimum at 7th step (140 seconds)', () => {
    // (2500 - 800) / 250 = 6.8 → step 7 = 140s
    expect(getSpawnInterval(140_000)).toBe(800)
  })
})
```

- [ ] **Step 2: テストを実行して FAIL を確認**

```bash
npm test -- scoreManager
```
期待値: モジュールが存在しないエラー

- [ ] **Step 3: 最小実装**

```typescript
// src/utils/scoreManager.ts
import {
  SCORE_PER_SECOND,
  COIN_SCORE,
  SPAWN_INTERVAL_START,
  SPAWN_INTERVAL_STEP,
  SPAWN_INTERVAL_MIN,
  DIFFICULTY_STEP_MS,
} from '../constants'

export function calculateScore(elapsedMs: number, coinCount: number): number {
  const timeScore = Math.floor(elapsedMs / 1000) * SCORE_PER_SECOND
  return timeScore + coinCount * COIN_SCORE
}

export function getSpawnInterval(elapsedMs: number): number {
  const steps = Math.floor(elapsedMs / DIFFICULTY_STEP_MS)
  const interval = SPAWN_INTERVAL_START - steps * SPAWN_INTERVAL_STEP
  return Math.max(interval, SPAWN_INTERVAL_MIN)
}
```

- [ ] **Step 4: テストを実行して PASS を確認**

```bash
npm test -- scoreManager
```
期待値: 全 10 テスト PASS

- [ ] **Step 5: コミット**

```bash
git add src/utils/scoreManager.ts src/__tests__/scoreManager.test.ts
git commit -m "feat: add scoreManager utility for score and difficulty calculation"
```

---

## Task 4: storage ユーティリティ（TDD）

**Files:**
- Create: `src/utils/storage.ts`
- Create: `src/__tests__/storage.test.ts`

- [ ] **Step 1: テストを書く（RED）**

```typescript
// src/__tests__/storage.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { getHighScore, saveHighScore } from '../utils/storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns 0 when no score has been saved', () => {
    expect(getHighScore()).toBe(0)
  })

  it('saves and retrieves a high score', () => {
    saveHighScore(500)
    expect(getHighScore()).toBe(500)
  })

  it('does not overwrite when new score is lower', () => {
    saveHighScore(500)
    saveHighScore(300)
    expect(getHighScore()).toBe(500)
  })

  it('overwrites when new score is higher', () => {
    saveHighScore(300)
    saveHighScore(500)
    expect(getHighScore()).toBe(500)
  })

  it('handles corrupted localStorage value gracefully', () => {
    localStorage.setItem('spaceRunner_highScore', 'invalid')
    expect(getHighScore()).toBe(0)
  })

  it('handles equal score without throwing', () => {
    saveHighScore(500)
    saveHighScore(500)
    expect(getHighScore()).toBe(500)
  })
})
```

- [ ] **Step 2: テストを実行して FAIL を確認**

```bash
npm test -- storage
```

- [ ] **Step 3: 最小実装**

```typescript
// src/utils/storage.ts
const HIGH_SCORE_KEY = 'spaceRunner_highScore'

export function getHighScore(): number {
  const stored = localStorage.getItem(HIGH_SCORE_KEY)
  if (!stored) return 0
  const parsed = parseInt(stored, 10)
  return isNaN(parsed) ? 0 : parsed
}

export function saveHighScore(score: number): void {
  if (score > getHighScore()) {
    localStorage.setItem(HIGH_SCORE_KEY, score.toString())
  }
}
```

- [ ] **Step 4: テストを実行して PASS を確認**

```bash
npm test -- storage
```
期待値: 全 6 テスト PASS

- [ ] **Step 5: コミット**

```bash
git add src/utils/storage.ts src/__tests__/storage.test.ts
git commit -m "feat: add storage utility for high score persistence"
```

---

## Task 5: orientationLock ユーティリティ（TDD）

**Files:**
- Create: `src/utils/orientationLock.ts`
- Create: `src/__tests__/orientationLock.test.ts`

- [ ] **Step 1: テストを書く（RED）**

```typescript
// src/__tests__/orientationLock.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { lockLandscape } from '../utils/orientationLock'

describe('lockLandscape', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('calls screen.orientation.lock with "landscape"', async () => {
    const lockMock = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(screen, 'orientation', {
      value: { lock: lockMock },
      configurable: true,
    })
    await lockLandscape()
    expect(lockMock).toHaveBeenCalledWith('landscape')
  })

  it('does not throw when screen.orientation is undefined', async () => {
    Object.defineProperty(screen, 'orientation', {
      value: undefined,
      configurable: true,
    })
    await expect(lockLandscape()).resolves.toBeUndefined()
  })

  it('does not throw when lock() rejects', async () => {
    Object.defineProperty(screen, 'orientation', {
      value: { lock: vi.fn().mockRejectedValue(new Error('not allowed')) },
      configurable: true,
    })
    await expect(lockLandscape()).resolves.toBeUndefined()
  })
})
```

- [ ] **Step 2: テストを実行して FAIL を確認**

```bash
npm test -- orientationLock
```

- [ ] **Step 3: 最小実装**

```typescript
// src/utils/orientationLock.ts
export async function lockLandscape(): Promise<void> {
  try {
    await screen.orientation.lock('landscape')
  } catch {
    // API 非対応または未許可 — 無視して続行
  }
}
```

- [ ] **Step 4: テストを実行して PASS を確認**

```bash
npm test -- orientationLock
```
期待値: 全 3 テスト PASS

- [ ] **Step 5: 全テストを実行して回帰がないことを確認**

```bash
npm test
```
期待値: 全テスト PASS

- [ ] **Step 6: コミット**

```bash
git add src/utils/orientationLock.ts src/__tests__/orientationLock.test.ts
git commit -m "feat: add orientationLock utility for landscape mode"
```

---

## Task 6: Preload シーン — Graphics API でテクスチャ生成

**Files:**
- Modify: `src/scenes/Preload.ts`

- [ ] **Step 1: Preload.ts を全書き換え**

```typescript
// src/scenes/Preload.ts
import Phaser from 'phaser'
import { SCENE_KEYS, ASSET_KEYS, COLORS, PLAYER_RADIUS } from '../constants'

export class Preload extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.PRELOAD })
  }

  create(): void {
    this.generatePlayerTexture()
    this.generateMeteorTexture()
    this.generateUFOTexture()
    this.generateAlienTexture()
    this.generateCoinTexture()
    this.scene.start(SCENE_KEYS.TITLE)
  }

  private generatePlayerTexture(): void {
    const r = PLAYER_RADIUS
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(COLORS.PLAYER_BODY)
    g.fillCircle(r, r, r)
    g.fillStyle(COLORS.PLAYER_VISOR)
    g.fillCircle(r, r - 4, Math.round(r * 0.45))
    g.generateTexture(ASSET_KEYS.PLAYER, r * 2, r * 2)
    g.destroy()
  }


  private generateMeteorTexture(): void {
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(COLORS.METEOR)
    g.fillCircle(20, 20, 20)
    g.fillStyle(COLORS.METEOR_SHADOW)
    g.fillCircle(12, 12, 8)
    g.generateTexture(ASSET_KEYS.METEOR, 40, 40)
    g.destroy()
  }

  private generateUFOTexture(): void {
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(COLORS.UFO_BODY)
    g.fillEllipse(28, 24, 56, 20)
    g.fillStyle(COLORS.UFO_DOME)
    g.fillEllipse(28, 14, 28, 18)
    g.generateTexture(ASSET_KEYS.UFO, 56, 38)
    g.destroy()
  }

  private generateAlienTexture(): void {
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(COLORS.ALIEN)
    g.fillRoundedRect(6, 14, 24, 26, 4)
    g.fillCircle(18, 14, 12)
    g.fillStyle(COLORS.ALIEN_EYE)
    g.fillCircle(12, 11, 4)
    g.fillCircle(24, 11, 4)
    g.generateTexture(ASSET_KEYS.ALIEN, 36, 40)
    g.destroy()
  }

  private generateCoinTexture(): void {
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(COLORS.COIN, 0.4)
    g.fillCircle(16, 16, 16)
    g.fillStyle(COLORS.COIN)
    g.fillCircle(16, 16, 12)
    g.fillStyle(0xffffff, 0.5)
    g.fillCircle(11, 11, 4)
    g.generateTexture(ASSET_KEYS.COIN, 32, 32)
    g.destroy()
  }
}
```

- [ ] **Step 2: ビルドエラーがないか確認**

```bash
npm run build 2>&1 | head -30
```
期待値: エラーなし（または Title シーン未作成の import エラーのみ、次タスクで解消）

- [ ] **Step 3: コミット**

```bash
git add src/scenes/Preload.ts
git commit -m "feat: generate all game textures via Phaser Graphics API in Preload"
```

---

## Task 7: Background オブジェクト — 流れる星の背景

**Files:**
- Create: `src/objects/Background.ts`

- [ ] **Step 1: Background.ts を作成**

```typescript
// src/objects/Background.ts
import Phaser from 'phaser'
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../constants'

interface Star {
  x: number
  y: number
  size: number
  speed: number
}

export class Background {
  private readonly graphics: Phaser.GameObjects.Graphics
  private readonly stars: Star[] = []

  constructor(scene: Phaser.Scene) {
    this.graphics = scene.add.graphics()
    this.initStars()
  }

  private initStars(): void {
    for (let i = 0; i < 60; i++) {
      this.stars.push({
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * GAME_HEIGHT,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 80 + 40,
      })
    }
  }

  update(delta: number): void {
    this.graphics.clear()
    this.graphics.fillStyle(COLORS.BG)
    this.graphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
    this.graphics.fillStyle(COLORS.STAR, 0.85)
    for (const star of this.stars) {
      star.x -= star.speed * (delta / 1000)
      if (star.x < 0) star.x = GAME_WIDTH
      this.graphics.fillRect(star.x, star.y, star.size, star.size)
    }
  }
}
```

- [ ] **Step 2: コミット**

```bash
git add src/objects/Background.ts
git commit -m "feat: add Background object with scrolling star parallax"
```

---

## Task 8: Player オブジェクト

**Files:**
- Create: `src/objects/Player.ts`

- [ ] **Step 1: Player.ts を作成**

```typescript
// src/objects/Player.ts
import Phaser from 'phaser'
import { ASSET_KEYS, PLAYER_RADIUS, JUMP_VELOCITY, MAX_JUMPS, GROUND_Y } from '../constants'
import { JumpController } from '../utils/jumpController'

export class Player extends Phaser.Physics.Arcade.Sprite {
  private readonly jumpCtrl: JumpController

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y - PLAYER_RADIUS, ASSET_KEYS.PLAYER)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.jumpCtrl = new JumpController(MAX_JUMPS)

    const body = this.body as Phaser.Physics.Arcade.Body
    // 当たり判定を少し小さく（子ども向けに優しい判定）
    body.setCircle(PLAYER_RADIUS - 3, 3, 3)
    body.setMaxVelocityY(900)
  }

  jump(): void {
    if (this.jumpCtrl.canJump()) {
      this.setVelocityY(JUMP_VELOCITY)
      this.jumpCtrl.onJump()
    }
  }

  onLand(): void {
    this.jumpCtrl.onLand()
  }

  get isInAir(): boolean {
    return this.jumpCtrl.jumpsUsed > 0
  }

  update(): void {
    if (this.isInAir) {
      this.setTint(0xffeaa7)
    } else {
      this.clearTint()
    }
  }
}
```

- [ ] **Step 2: コミット**

```bash
git add src/objects/Player.ts
git commit -m "feat: add Player object with double-jump and arcade physics"
```

---

## Task 9: ObstacleGroup オブジェクト

**Files:**
- Create: `src/objects/ObstacleGroup.ts`

- [ ] **Step 1: ObstacleGroup.ts を作成**

```typescript
// src/objects/ObstacleGroup.ts
import Phaser from 'phaser'
import { ASSET_KEYS, GAME_WIDTH, GROUND_Y, SCROLL_SPEED } from '../constants'

type ObstacleType = 'meteor' | 'ufo' | 'alien'

const OBSTACLE_CONFIGS: Record<ObstacleType, { key: string; halfH: number }> = {
  meteor: { key: ASSET_KEYS.METEOR, halfH: 20 },
  ufo:    { key: ASSET_KEYS.UFO,    halfH: 19 },
  alien:  { key: ASSET_KEYS.ALIEN,  halfH: 20 },
}

const TYPES: ObstacleType[] = ['meteor', 'ufo', 'alien']

export class ObstacleGroup {
  private readonly group: Phaser.Physics.Arcade.Group

  constructor(scene: Phaser.Scene) {
    this.group = scene.physics.add.group()
  }

  get physicsGroup(): Phaser.Physics.Arcade.Group {
    return this.group
  }

  spawnRandom(): void {
    const type = Phaser.Math.RND.pick(TYPES)
    const { key, halfH } = OBSTACLE_CONFIGS[type]
    const sprite = this.group.create(
      GAME_WIDTH + 60,
      GROUND_Y - halfH,
      key,
    ) as Phaser.Physics.Arcade.Sprite

    sprite.setVelocityX(-SCROLL_SPEED)
    const body = sprite.body as Phaser.Physics.Arcade.Body
    body.allowGravity = false
    // 当たり判定をテクスチャより少し小さく（優しい判定）
    body.setSize(
      sprite.width - 8,
      sprite.height - 8,
    )
  }

  update(): void {
    this.group.getChildren().forEach((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite
      if (sprite.x < -100) sprite.destroy()
    })
  }
}
```

- [ ] **Step 2: コミット**

```bash
git add src/objects/ObstacleGroup.ts
git commit -m "feat: add ObstacleGroup with randomized meteor, UFO, and alien spawning"
```

---

## Task 10: StarCoinGroup オブジェクト

**Files:**
- Create: `src/objects/StarCoinGroup.ts`

- [ ] **Step 1: StarCoinGroup.ts を作成**

```typescript
// src/objects/StarCoinGroup.ts
import Phaser from 'phaser'
import { ASSET_KEYS, GAME_WIDTH, GROUND_Y, SCROLL_SPEED } from '../constants'

export class StarCoinGroup {
  private readonly group: Phaser.Physics.Arcade.Group

  constructor(scene: Phaser.Scene) {
    this.group = scene.physics.add.group()
  }

  get physicsGroup(): Phaser.Physics.Arcade.Group {
    return this.group
  }

  spawn(): void {
    const y = Phaser.Math.Between(GROUND_Y - 220, GROUND_Y - 50)
    const sprite = this.group.create(
      GAME_WIDTH + 40,
      y,
      ASSET_KEYS.COIN,
    ) as Phaser.Physics.Arcade.Sprite

    sprite.setVelocityX(-SCROLL_SPEED)
    const body = sprite.body as Phaser.Physics.Arcade.Body
    body.allowGravity = false
  }

  update(): void {
    this.group.getChildren().forEach((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite
      if (sprite.x < -50) sprite.destroy()
    })
  }
}
```

- [ ] **Step 2: コミット**

```bash
git add src/objects/StarCoinGroup.ts
git commit -m "feat: add StarCoinGroup with random height coin spawning"
```

---

## Task 11: Title シーン

**Files:**
- Create: `src/scenes/Title.ts`

- [ ] **Step 1: Title.ts を作成**

```typescript
// src/scenes/Title.ts
import Phaser from 'phaser'
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT, COLORS } from '../constants'
import { lockLandscape } from '../utils/orientationLock'
import { getHighScore } from '../utils/storage'

export class Title extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.TITLE })
  }

  create(): void {
    // 背景
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.BG)

    // 静的な星
    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(0, GAME_WIDTH)
      const y = Phaser.Math.Between(0, GAME_HEIGHT)
      const size = Phaser.Math.Between(1, 3)
      this.add.rectangle(x, y, size, size, COLORS.STAR)
    }

    // タイトル
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 90, '🚀 SPACE RUNNER', {
        fontSize: '44px',
        color: '#ffd700',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    // ハイスコア表示
    const hiScore = getHighScore()
    if (hiScore > 0) {
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 25, `BEST: ${hiScore}`, {
          fontSize: '22px',
          color: '#74b9ff',
        })
        .setOrigin(0.5)
    }

    // タップして開始（点滅）
    const startText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 55, 'タップしてスタート！', {
        fontSize: '28px',
        color: '#ffffff',
      })
      .setOrigin(0.5)

    this.tweens.add({
      targets: startText,
      alpha: 0,
      duration: 700,
      ease: 'Power2',
      yoyo: true,
      repeat: -1,
    })

    // 入力
    this.input.once('pointerdown', () => this.startGame())
    this.input.keyboard?.once('keydown-SPACE', () => this.startGame())
  }

  private async startGame(): Promise<void> {
    await lockLandscape()
    this.scene.start(SCENE_KEYS.GAME)
  }
}
```

- [ ] **Step 2: コミット**

```bash
git add src/scenes/Title.ts
git commit -m "feat: add Title scene with orientation lock on tap"
```

---

## Task 12: Game シーン — メインゲームプレイ

**Files:**
- Modify: `src/scenes/Game.ts`

- [ ] **Step 1: Game.ts を全書き換え**

```typescript
// src/scenes/Game.ts
import Phaser from 'phaser'
import {
  SCENE_KEYS,
  GAME_WIDTH,
  GAME_HEIGHT,
  GROUND_Y,
  PLAYER_X,
  COLORS,
} from '../constants'
import { Player } from '../objects/Player'
import { ObstacleGroup } from '../objects/ObstacleGroup'
import { StarCoinGroup } from '../objects/StarCoinGroup'
import { Background } from '../objects/Background'
import { calculateScore, getSpawnInterval } from '../utils/scoreManager'
import { getHighScore, saveHighScore } from '../utils/storage'

export class Game extends Phaser.Scene {
  private player!: Player
  private obstacleGroup!: ObstacleGroup
  private coinGroup!: StarCoinGroup
  private background!: Background
  private scoreText!: Phaser.GameObjects.Text
  private coinCount = 0
  private startTime = 0
  private score = 0
  private isGameOver = false

  constructor() {
    super({ key: SCENE_KEYS.GAME })
  }

  create(): void {
    this.coinCount = 0
    this.isGameOver = false
    this.startTime = this.time.now

    // 描画順: 背景 → 地面ビジュアル → プレイヤー → 障害物/コイン → HUD
    this.background = new Background(this)
    this.createGroundVisual()
    this.player = new Player(this, PLAYER_X, GROUND_Y)
    this.obstacleGroup = new ObstacleGroup(this)
    this.coinGroup = new StarCoinGroup(this)

    // プレイヤー生成後にコライダーを設定
    this.setupGroundCollider()
    this.setupCollisions()
    this.setupInput()
    this.setupHUD()
    this.scheduleNextObstacle()
    this.scheduleCoin()
  }

  update(_time: number, delta: number): void {
    if (this.isGameOver) return

    this.background.update(delta)
    this.player.update()
    this.obstacleGroup.update()
    this.coinGroup.update()

    const elapsed = this.time.now - this.startTime
    this.score = calculateScore(elapsed, this.coinCount)
    this.scoreText.setText(`SCORE: ${this.score}`)
  }

  private createGroundVisual(): void {
    // 地面の装飾ライン
    this.add.rectangle(GAME_WIDTH / 2, GROUND_Y + 1, GAME_WIDTH, 3, COLORS.GROUND_LINE)
    // 地面の塗り
    this.add.rectangle(GAME_WIDTH / 2, GROUND_Y + 26, GAME_WIDTH, 50, COLORS.GROUND)
  }

  private setupGroundCollider(): void {
    // 透明な物理ボディ（衝突用）
    const groundRect = this.add.rectangle(GAME_WIDTH / 2, GROUND_Y + 26, GAME_WIDTH, 50)
    groundRect.setAlpha(0)
    this.physics.add.existing(groundRect, true)
    this.physics.add.collider(this.player, groundRect, () => this.player.onLand())
  }

  private setupCollisions(): void {
    // 障害物に触れたらゲームオーバー
    this.physics.add.overlap(
      this.player,
      this.obstacleGroup.physicsGroup,
      () => this.triggerGameOver(),
    )
    // コインに触れたらカウントアップ
    this.physics.add.overlap(
      this.player,
      this.coinGroup.physicsGroup,
      (_player, coin) => {
        (coin as Phaser.Physics.Arcade.Sprite).destroy()
        this.coinCount++
      },
    )
  }

  private setupInput(): void {
    this.input.keyboard?.on('keydown-SPACE', () => this.handleJump())
    this.input.keyboard?.on('keydown-UP', () => this.handleJump())
    this.input.on('pointerdown', () => this.handleJump())
  }

  private handleJump(): void {
    if (!this.isGameOver) this.player.jump()
  }

  private setupHUD(): void {
    this.scoreText = this.add
      .text(16, 16, 'SCORE: 0', {
        fontSize: '24px',
        color: '#ffd700',
        fontStyle: 'bold',
      })
      .setDepth(10)

    const hiScore = getHighScore()
    this.add
      .text(GAME_WIDTH - 16, 16, `BEST: ${hiScore}`, {
        fontSize: '18px',
        color: '#74b9ff',
      })
      .setOrigin(1, 0)
      .setDepth(10)
  }

  private scheduleNextObstacle(): void {
    if (this.isGameOver) return
    const elapsed = this.time.now - this.startTime
    const interval = getSpawnInterval(elapsed)
    this.time.delayedCall(interval, () => {
      if (!this.isGameOver) {
        this.obstacleGroup.spawnRandom()
        this.scheduleNextObstacle()
      }
    })
  }

  private scheduleCoin(): void {
    const delay = Phaser.Math.Between(3000, 6000)
    this.time.delayedCall(delay, () => {
      if (!this.isGameOver) {
        this.coinGroup.spawn()
        this.scheduleCoin()
      }
    })
  }

  private triggerGameOver(): void {
    if (this.isGameOver) return
    this.isGameOver = true
    saveHighScore(this.score)
    this.cameras.main.shake(300, 0.015)
    this.time.delayedCall(800, () => {
      this.scene.start(SCENE_KEYS.GAME_OVER, { score: this.score })
    })
  }
}
```

- [ ] **Step 2: コミット**

```bash
git add src/scenes/Game.ts
git commit -m "feat: implement main Game scene with obstacles, coins, and scoring"
```

---

## Task 13: GameOver シーン

**Files:**
- Create: `src/scenes/GameOver.ts`

- [ ] **Step 1: GameOver.ts を作成**

```typescript
// src/scenes/GameOver.ts
import Phaser from 'phaser'
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT, COLORS } from '../constants'
import { getHighScore } from '../utils/storage'

interface GameOverData {
  score: number
}

export class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.GAME_OVER })
  }

  create(data: GameOverData): void {
    const { score = 0 } = data

    // 暗いオーバーレイ
    this.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      0x000000,
      0.72,
    )

    // GAME OVER テキスト
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 90, 'GAME OVER', {
        fontSize: '52px',
        color: '#ff7675',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    // スコア
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, `スコア: ${score}`, {
        fontSize: '34px',
        color: '#ffd700',
      })
      .setOrigin(0.5)

    // ハイスコア / 新記録
    const hiScore = getHighScore()
    const isNewRecord = score >= hiScore && score > 0
    if (isNewRecord) {
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 25, '🎉 NEW RECORD!', {
          fontSize: '26px',
          color: '#55efc4',
        })
        .setOrigin(0.5)
    } else {
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 25, `ハイスコア: ${hiScore}`, {
          fontSize: '22px',
          color: '#74b9ff',
        })
        .setOrigin(0.5)
    }

    // リトライボタン
    const retryBtn = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 88, 'もういちど！', {
        fontSize: '30px',
        color: '#ffffff',
        backgroundColor: '#6c5ce7',
        padding: { x: 24, y: 12 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })

    this.tweens.add({
      targets: retryBtn,
      scaleX: 1.06,
      scaleY: 1.06,
      duration: 600,
      ease: 'Power2',
      yoyo: true,
      repeat: -1,
    })

    retryBtn.on('pointerdown', () => this.scene.start(SCENE_KEYS.TITLE))
    this.input.keyboard?.once('keydown-SPACE', () => this.scene.start(SCENE_KEYS.TITLE))
  }
}
```

- [ ] **Step 2: コミット**

```bash
git add src/scenes/GameOver.ts
git commit -m "feat: add GameOver scene with score display and retry button"
```

---

## Task 14: 動作確認・最終検証

**Files:**
- なし（検証のみ）

- [ ] **Step 1: 全テストを実行してカバレッジを確認**

```bash
npm test -- --coverage
```
期待値: 全テスト PASS、utility ファイルのカバレッジ 80% 以上

- [ ] **Step 2: 開発サーバーを起動してブラウザで動作確認**

```bash
npm run dev
```
ブラウザで http://localhost:3000 を開き、以下を確認：
1. Title 画面が表示される
2. スペースキーでゲーム開始できる
3. スペースキーでジャンプ・ダブルジャンプできる
4. 障害物が右から流れてくる
5. 障害物に当たるとゲームオーバー画面に遷移する
6. 「もういちど！」でタイトルに戻れる
7. スコアが画面左上に表示される
8. ハイスコアが保存・表示される

- [ ] **Step 3: TypeScript のビルドエラーがないことを確認**

```bash
npm run build
```
期待値: ビルド成功、エラーなし

- [ ] **Step 4: 最終コミット**

```bash
git add -A
git commit -m "chore: verify space-runner implementation complete"
```
