// src/objects/Player.ts
import Phaser from 'phaser'
import { ASSET_KEYS, PLAYER_RADIUS, JUMP_VELOCITY, MAX_JUMPS } from '../constants'
import { JumpController } from '../utils/jumpController'

export class Player extends Phaser.Physics.Arcade.Sprite {
  private readonly jumpCtrl: JumpController

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y - PLAYER_RADIUS, ASSET_KEYS.PLAYER)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.jumpCtrl = new JumpController(MAX_JUMPS)

    const body = this.body as Phaser.Physics.Arcade.Body
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
