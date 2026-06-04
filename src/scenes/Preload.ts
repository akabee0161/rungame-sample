// src/scenes/Preload.ts
import Phaser from 'phaser'
import { SCENE_KEYS, ASSET_KEYS, COLORS } from '../constants'

export class Preload extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.PRELOAD })
  }

  preload(): void {
    this.load.spritesheet(ASSET_KEYS.ASTRONAUT_RUN, 'img/Astronaut_Run.png', {
      frameWidth: 24,
      frameHeight: 24,
    })
    this.load.spritesheet(ASSET_KEYS.ASTRONAUT_IDLE, 'img/Astronaut_Idle.png', {
      frameWidth: 24,
      frameHeight: 24,
    })
    this.load.spritesheet(ASSET_KEYS.ASTRONAUT_JUMP, 'img/Astronaut_Jump.png', {
      frameWidth: 24,
      frameHeight: 24,
    })
    this.load.spritesheet(ASSET_KEYS.ASTRONAUT_DEATH, 'img/Astronaut_Death.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
  }

  create(): void {
    this.generateMeteorTexture()
    this.generateUFOTexture()
    this.generateAlienTexture()
    this.generateCoinTexture()
    this.scene.start(SCENE_KEYS.TITLE)
  }

  private generateMeteorTexture(): void {
    const g = this.make.graphics({}, false)
    g.fillStyle(COLORS.METEOR)
    g.fillCircle(20, 20, 20)
    g.fillStyle(COLORS.METEOR_SHADOW)
    g.fillCircle(12, 12, 8)
    g.generateTexture(ASSET_KEYS.METEOR, 40, 40)
    g.destroy()
  }

  private generateUFOTexture(): void {
    const g = this.make.graphics({}, false)
    g.fillStyle(COLORS.UFO_BODY)
    g.fillEllipse(28, 24, 56, 20)
    g.fillStyle(COLORS.UFO_DOME)
    g.fillEllipse(28, 14, 28, 18)
    g.generateTexture(ASSET_KEYS.UFO, 56, 38)
    g.destroy()
  }

  private generateAlienTexture(): void {
    const g = this.make.graphics({}, false)
    g.fillStyle(COLORS.ALIEN)
    g.fillRoundedRect(6, 14, 24, 26, 4)
    g.fillCircle(18, 14, 12)
    g.fillStyle(COLORS.ALIEN_EYE)
    g.fillCircle(12, 11, 4)
    g.fillCircle(24, 11, 4)
    g.generateTexture(ASSET_KEYS.ALIEN, 36, 40)
    g.destroy()
  }

  private generateCoinTexture(): void {
    const g = this.make.graphics({}, false)
    g.fillStyle(COLORS.COIN, 0.4)
    g.fillCircle(16, 16, 16)
    g.fillStyle(COLORS.COIN)
    g.fillCircle(16, 16, 12)
    g.fillStyle(0xffffff, 0.5)
    g.fillCircle(11, 11, 4)
    g.generateTexture(ASSET_KEYS.COIN, 32, 32)
    g.destroy()
  }
}
