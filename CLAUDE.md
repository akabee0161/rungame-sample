# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Space Runner — 5〜8歳向け宇宙テーマのエンドレスランナーゲーム（Phaser 3.90 + TypeScript + Vite）。

## Commands

```bash
npm run dev      # 開発サーバー起動（localhost:3000）
npm test         # Vitest でテスト実行（jsdom 環境）
npm run build    # tsc + Vite ビルド（出力先: out/）
npm run preview  # ビルド結果のプレビュー
```

**ESLint / Prettier は未導入**。コード品質は TypeScript の型チェックとテストで担保する。

## Architecture

```
src/
├── scenes/      # Phaser シーン（Boot → Preload → Title → Game ↔ GameOver）
├── objects/     # ゲームオブジェクト（Phaser 依存）
├── utils/       # 純粋関数（Phaser 非依存、テスト対象）
│   ├── jumpController.ts   — ダブルジャンプロジック
│   ├── scoreManager.ts     — スコア・難易度計算
│   ├── storage.ts          — ハイスコア保存（LocalStorage）
│   └── orientationLock.ts  — Screen Orientation API ラッパー
└── constants.ts # ゲーム定数の唯一の真実（色・速度・難易度パラメーターなど）
```

**新しいゲームロジックは `src/utils/` に純粋関数として実装し、Phaser に依存させない。**

## Key Conventions

- **グラフィック**: 全て Phaser の Graphics API で動的生成（外部画像不要）。`public/assets/Astronaut_*.png` はリファレンス用途のみ。
- **定数**: `src/constants.ts` を唯一の変更場所とする。ハードコーディング禁止。
- **LocalStorage**: ハイスコア保存キーは `spaceRunner_highScore`。
- **デプロイ**: ベースパス `/labs/games/rungame/`（個人サーバー）。`npm run build` で `out/` に出力。

## TypeScript Strictness

`tsconfig.json` で `noUnusedLocals` / `noUnusedParameters` が有効。未使用の変数・引数はビルドエラーになるため、実装時に削除すること。

## Testing

- **対象**: `src/utils/` の純粋関数（Phaser シーンはテスト対象外）
- **カバレッジ目標**: ユーティリティ関数で 80% 以上
- **実行環境**: jsdom（Phaser の描画は起動しない）
- 新しいユーティリティ関数を追加するときは必ずテストを先に書く（TDD）
