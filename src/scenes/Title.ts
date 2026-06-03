import Phaser from 'phaser'
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT, COLORS } from '../constants'
import { lockLandscape } from '../utils/orientationLock'
import { getHighScore } from '../utils/storage'

export class Title extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.TITLE })
  }

  create(): void {
    // 背景
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.BG)

    // 静的な星
    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(0, GAME_WIDTH)
      const y = Phaser.Math.Between(0, GAME_HEIGHT)
      const size = Phaser.Math.Between(1, 3)
      this.add.rectangle(x, y, size, size, COLORS.STAR)
    }

    // タイトル
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 90, '🚀 SPACE RUNNER', {
        fontSize: '44px',
        color: '#ffd700',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    // ハイスコア表示
    const hiScore = getHighScore()
    if (hiScore > 0) {
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 25, `BEST: ${hiScore}`, {
          fontSize: '22px',
          color: '#74b9ff',
        })
        .setOrigin(0.5)
    }

    // タップして開始（点滅）
    const startText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 55, 'タップしてスタート！', {
        fontSize: '28px',
        color: '#ffffff',
      })
      .setOrigin(0.5)

    this.tweens.add({
      targets: startText,
      alpha: 0,
      duration: 700,
      ease: 'Power2',
      yoyo: true,
      repeat: -1,
    })

    // 入力
    this.input.once('pointerdown', () => this.startGame())
    this.input.keyboard?.once('keydown-SPACE', () => this.startGame())
  }

  private async startGame(): Promise<void> {
    await lockLandscape()
    this.scene.start(SCENE_KEYS.GAME)
  }
}
