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
