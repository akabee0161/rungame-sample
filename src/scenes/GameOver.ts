import Phaser from 'phaser'
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../constants'
import { getHighScore } from '../utils/storage'

interface GameOverData {
  score: number
}

export class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.GAME_OVER })
  }

  create(data: GameOverData): void {
    const { score = 0 } = data

    // 暗いオーバーレイ
    this.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      0x000000,
      0.72,
    )

    // GAME OVER テキスト
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 90, 'GAME OVER', {
        fontSize: '52px',
        color: '#ff7675',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    // スコア
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, `スコア: ${score}`, {
        fontSize: '34px',
        color: '#ffd700',
      })
      .setOrigin(0.5)

    // ハイスコア / 新記録
    const hiScore = getHighScore()
    const isNewRecord = score >= hiScore && score > 0
    if (isNewRecord) {
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 25, '🎉 NEW RECORD!', {
          fontSize: '26px',
          color: '#55efc4',
        })
        .setOrigin(0.5)
    } else {
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 25, `ハイスコア: ${hiScore}`, {
          fontSize: '22px',
          color: '#74b9ff',
        })
        .setOrigin(0.5)
    }

    // リトライボタン
    const retryBtn = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 88, 'もういちど！', {
        fontSize: '30px',
        color: '#ffffff',
        backgroundColor: '#6c5ce7',
        padding: { x: 24, y: 12 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })

    this.tweens.add({
      targets: retryBtn,
      scaleX: 1.06,
      scaleY: 1.06,
      duration: 600,
      ease: 'Power2',
      yoyo: true,
      repeat: -1,
    })

    retryBtn.on('pointerdown', () => this.scene.start(SCENE_KEYS.TITLE))
    this.input.keyboard?.once('keydown-SPACE', () => this.scene.start(SCENE_KEYS.TITLE))
  }
}
