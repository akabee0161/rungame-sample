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
    body.setSize(sprite.width - 8, sprite.height - 8)
  }

  update(): void {
    this.group.getChildren().forEach((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite
      if (sprite.x < -100) sprite.destroy()
    })
  }
}
