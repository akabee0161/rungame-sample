# Phaser スプライトアニメーション テスト — 設計ドキュメント

**日付:** 2026-06-03  
**目的:** Phaser 3 + Vite + TypeScript を使ったスプライトアニメーションの学習・実験

---

## 目的と背景

Next.js と Canvas 2D でウェブゲームを作った経験を持つユーザーが、Phaser 3 のコアコンセプト（シーン管理・スプライトアニメーション・アセット管理）を実際に動かしながら学ぶための最小限のデモプロジェクト。

---

## 技術スタック

| 役割 | 採用技術 | 理由 |
|------|----------|------|
| ビルドツール | Vite 6 | Phaser 公式テンプレート準拠、HMR対応 |
| 言語 | TypeScript 5 | 型定義による開発体験向上 |
| ゲームエンジン | Phaser 3（最新安定版） | 実装例・チュートリアルが豊富 |
| アセット | Phaser サンプル素材（dude.png） | 追加作業不要ですぐ動かせる |

**Phaser 4 不採用の理由:** 2026年4月発表の新バージョンだが、学習リソース・実装例が不十分なため。コアコンセプトを Phaser 3 で習得後に評価する。

---

## アーキテクチャ

### シーン構成

```
Boot → Preload → Game
```

| シーン | 役割 |
|--------|------|
| Boot | Phaser.Game の設定初期化、最初のシーン起動 |
| Preload | アセット（スプライトシート）の読み込み、ローディングバー表示 |
| Game | スプライト表示、アニメーション定義・再生、キー入力処理 |

### ファイル構成

```
phaser-sprite-test/
├── public/
│   └── assets/
│       └── dude.png          # スプライトシート（32×48px × 9フレーム）
├── src/
│   ├── scenes/
│   │   ├── Boot.ts           # 設定初期化
│   │   ├── Preload.ts        # アセット読み込み
│   │   └── Game.ts           # メインシーン
│   └── main.ts               # Phaser.Game インスタンス生成
├── index.html
├── vite.config.ts
└── package.json
```

---

## Game シーンの仕様

### 表示内容

- `dude.png` スプライトシートを使ったキャラクター表示
- 画面中央にスプライトを配置

### アニメーション定義

| アニメーション名 | フレーム | 条件 |
|-----------------|----------|------|
| `idle` | 4番フレーム（静止） | キー未入力 |
| `walk_left` | 0〜3番フレーム | ← キー押下 |
| `walk_right` | 5〜8番フレーム | → キー押下 |

### 入力処理

- `cursor.left`: 左移動 + `walk_left` アニメーション再生
- `cursor.right`: 右移動 + `walk_right` アニメーション再生
- 未入力: `idle` アニメーション再生

---

## 実装で学べること

- Phaser のゲームループ（`create` / `update`）
- シーン管理と遷移
- `load.spritesheet()` によるスプライトシート読み込み
- `anims.create()` によるアニメーション定義
- `sprite.play()` によるアニメーション切り替え
- `input.keyboard.createCursorKeys()` によるキー入力処理
- アセットのライフサイクル（Preload → Game）

---

## スコープ

### スコープ内

- スプライトアニメーション表示（idle / 歩行左右）
- カーソルキーによる移動とアニメーション切り替え
- Boot → Preload → Game のシーン遷移

### スコープ外（今回は含めない）

- 物理エンジン（衝突判定・重力）
- スコア・HUD などの UI
- サウンド
- マップ・タイルセット
- 敵キャラクター・ゲームロジック

---

## セットアップ手順

```bash
# 1. Vite + TypeScript プロジェクト生成
npm create vite@latest . -- --template vanilla-ts

# 2. Phaser 3 インストール
npm install phaser

# 3. 依存関係インストール
npm install

# 4. dev server 起動
npm run dev
```
