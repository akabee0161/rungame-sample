import Phaser from 'phaser'
import { SCENE_KEYS, ANIM_KEYS, ASSET_KEYS } from '../constants'
import { buildAnimConfigs } from '../animConfigs'

export class Game extends Phaser.Scene {
  private sprite!: Phaser.GameObjects.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super({ key: SCENE_KEYS.GAME })
  }

  create(): void {
    const { width, height } = this.scale

    this.registerAnimations()

    this.sprite = this.add.sprite(width / 2, height / 2, ASSET_KEYS.DUDE)
    this.sprite.setScale(3)
    this.sprite.play(ANIM_KEYS.IDLE)

    this.cursors = this.input.keyboard!.createCursorKeys()

    this.add
      .text(width / 2, height - 30, '← → キーで移動', {
        fontSize: '16px',
        color: '#94a3b8',
      })
      .setOrigin(0.5)
  }

  update(): void {
    const speed = 3

    if (this.cursors.left.isDown) {
      this.sprite.x -= speed
      this.sprite.play(ANIM_KEYS.WALK_LEFT, true)
    } else if (this.cursors.right.isDown) {
      this.sprite.x += speed
      this.sprite.play(ANIM_KEYS.WALK_RIGHT, true)
    } else {
      this.sprite.play(ANIM_KEYS.IDLE, true)
    }
  }

  private registerAnimations(): void {
    buildAnimConfigs().forEach(({ key, assetKey, frames, frameRate, repeat }) => {
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers(assetKey, frames),
        frameRate,
        repeat,
      })
    })
  }
}
