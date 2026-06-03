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
