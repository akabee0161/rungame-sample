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
