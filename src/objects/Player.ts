// src/objects/Player.ts
import Phaser from 'phaser'
import { ASSET_KEYS, ANIM_KEYS, PLAYER_SCALE, JUMP_VELOCITY, MAX_JUMPS } from '../constants'
import { JumpController } from '../utils/jumpController'

// Frame dimensions of the astronaut spritesheets (in texture pixels, before scale)
const FRAME_W = 24
const FRAME_H = 24

// Physics body dimensions in texture pixels (before scale)
// Body is slightly narrower than the frame, bottom-aligned to match the feet
const BODY_W = 12
const BODY_H = 22
const BODY_OFFSET_X = (FRAME_W - BODY_W) / 2   // 6: horizontally centered
const BODY_OFFSET_Y = FRAME_H - BODY_H           // 2: bottom-aligned

export class Player extends Phaser.Physics.Arcade.Sprite {
  private readonly jumpCtrl: JumpController

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // Position sprite so its bottom edge sits at y (= GROUND_Y)
    const displayHalfH = (FRAME_H * PLAYER_SCALE) / 2
    super(scene, x, y - displayHalfH, ASSET_KEYS.ASTRONAUT_RUN)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setScale(PLAYER_SCALE)
    this.jumpCtrl = new JumpController(MAX_JUMPS)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(BODY_W, BODY_H)
    body.setOffset(BODY_OFFSET_X, BODY_OFFSET_Y)
    body.setMaxVelocityY(900)

    this.registerAnimations(scene)
    this.play(ANIM_KEYS.RUN)
  }

  private registerAnimations(scene: Phaser.Scene): void {
    const { anims } = scene
    if (!anims.exists(ANIM_KEYS.RUN)) {
      anims.create({
        key: ANIM_KEYS.RUN,
        frames: anims.generateFrameNumbers(ASSET_KEYS.ASTRONAUT_RUN, { start: 0, end: 5 }),
        frameRate: 12,
        repeat: -1,
      })
    }
    if (!anims.exists(ANIM_KEYS.IDLE)) {
      anims.create({
        key: ANIM_KEYS.IDLE,
        frames: anims.generateFrameNumbers(ASSET_KEYS.ASTRONAUT_IDLE, { start: 0, end: 5 }),
        frameRate: 6,
        repeat: -1,
      })
    }
    if (!anims.exists(ANIM_KEYS.JUMP)) {
      anims.create({
        key: ANIM_KEYS.JUMP,
        frames: anims.generateFrameNumbers(ASSET_KEYS.ASTRONAUT_JUMP, { start: 0, end: 4 }),
        frameRate: 10,
        repeat: 0,
      })
    }
    if (!anims.exists(ANIM_KEYS.DEATH)) {
      anims.create({
        key: ANIM_KEYS.DEATH,
        frames: anims.generateFrameNumbers(ASSET_KEYS.ASTRONAUT_DEATH, { start: 0, end: 3 }),
        frameRate: 8,
        repeat: 0,
      })
    }
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

  playDeath(): void {
    this.play(ANIM_KEYS.DEATH)
  }

  get isInAir(): boolean {
    return this.jumpCtrl.jumpsUsed > 0
  }

  update(): void {
    if (this.isInAir) {
      this.play(ANIM_KEYS.JUMP, true)
    } else {
      this.play(ANIM_KEYS.RUN, true)
    }
  }
}
