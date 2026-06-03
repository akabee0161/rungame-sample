// src/objects/Background.ts
import Phaser from 'phaser'
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../constants'

interface Star {
  x: number
  y: number
  size: number
  speed: number
}

export class Background {
  private readonly graphics: Phaser.GameObjects.Graphics
  private readonly stars: Star[] = []

  constructor(scene: Phaser.Scene) {
    this.graphics = scene.add.graphics()
    this.initStars()
  }

  private initStars(): void {
    for (let i = 0; i < 60; i++) {
      this.stars.push({
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * GAME_HEIGHT,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 80 + 40,
      })
    }
  }

  update(delta: number): void {
    this.graphics.clear()
    this.graphics.fillStyle(COLORS.BG)
    this.graphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
    this.graphics.fillStyle(COLORS.STAR, 0.85)
    for (const star of this.stars) {
      star.x -= star.speed * (delta / 1000)
      if (star.x < 0) star.x = GAME_WIDTH
      this.graphics.fillRect(star.x, star.y, star.size, star.size)
    }
  }
}
