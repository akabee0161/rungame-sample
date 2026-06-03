import Phaser from 'phaser'
import { SCENE_KEYS, ASSET_KEYS } from '../constants'

export class Preload extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.PRELOAD })
  }

  preload(): void {
    const { width, height } = this.scale

    const progressBar = this.add.graphics()
    const progressBox = this.add.graphics()
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50)

    this.load.on('progress', (value: number) => {
      progressBar.clear()
      progressBar.fillStyle(0x6366f1, 1)
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30)
    })

    this.load.on('complete', () => {
      progressBar.destroy()
      progressBox.destroy()
    })

    this.load.spritesheet(ASSET_KEYS.DUDE, 'assets/dude.png', {
      frameWidth: 32,
      frameHeight: 48,
    })
  }

  create(): void {
    this.scene.start(SCENE_KEYS.GAME)
  }
}
