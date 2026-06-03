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
