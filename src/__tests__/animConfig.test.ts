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
