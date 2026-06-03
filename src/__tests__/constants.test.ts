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
