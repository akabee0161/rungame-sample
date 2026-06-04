import Phaser from 'phaser'
import {
  SCENE_KEYS,
  GAME_WIDTH,
  GROUND_Y,
  PLAYER_X,
  COLORS,
} from '../constants'
import { Player } from '../objects/Player'
import { ObstacleGroup } from '../objects/ObstacleGroup'
import { StarCoinGroup } from '../objects/StarCoinGroup'
import { Background } from '../objects/Background'
import { calculateScore, getSpawnInterval } from '../utils/scoreManager'
import { getHighScore, saveHighScore } from '../utils/storage'

export class Game extends Phaser.Scene {
  private player!: Player
  private obstacleGroup!: ObstacleGroup
  private coinGroup!: StarCoinGroup
  private background!: Background
  private scoreText!: Phaser.GameObjects.Text
  private coinCount = 0
  private startTime = 0
  private score = 0
  private isGameOver = false

  constructor() {
    super({ key: SCENE_KEYS.GAME })
  }

  create(): void {
    this.coinCount = 0
    this.isGameOver = false
    this.startTime = this.time.now

    // 描画順: 背景 → 地面ビジュアル → プレイヤー → 障害物/コイン → HUD
    this.background = new Background(this)
    this.createGroundVisual()
    this.player = new Player(this, PLAYER_X, GROUND_Y)
    this.obstacleGroup = new ObstacleGroup(this)
    this.coinGroup = new StarCoinGroup(this)

    // プレイヤー生成後にコライダーを設定
    this.setupGroundCollider()
    this.setupCollisions()
    this.setupInput()
    this.setupHUD()
    this.scheduleNextObstacle()
    this.scheduleCoin()
  }

  update(_time: number, delta: number): void {
    if (this.isGameOver) return

    this.background.update(delta)
    this.player.update()
    this.obstacleGroup.update()
    this.coinGroup.update()

    const elapsed = this.time.now - this.startTime
    this.score = calculateScore(elapsed, this.coinCount)
    this.scoreText.setText(`SCORE: ${this.score}`)
  }

  private createGroundVisual(): void {
    // 地面の装飾ライン
    this.add.rectangle(GAME_WIDTH / 2, GROUND_Y + 1, GAME_WIDTH, 3, COLORS.GROUND_LINE)
    // 地面の塗り
    this.add.rectangle(GAME_WIDTH / 2, GROUND_Y + 26, GAME_WIDTH, 50, COLORS.GROUND)
  }

  private setupGroundCollider(): void {
    // 透明な物理ボディ（衝突用）
    const groundRect = this.add.rectangle(GAME_WIDTH / 2, GROUND_Y + 26, GAME_WIDTH, 50)
    groundRect.setAlpha(0)
    this.physics.add.existing(groundRect, true)
    this.physics.add.collider(this.player, groundRect, () => this.player.onLand())
  }

  private setupCollisions(): void {
    // 障害物に触れたらゲームオーバー
    this.physics.add.overlap(
      this.player,
      this.obstacleGroup.physicsGroup,
      () => this.triggerGameOver(),
    )
    // コインに触れたらカウントアップ
    this.physics.add.overlap(
      this.player,
      this.coinGroup.physicsGroup,
      (_player, coin) => {
        (coin as Phaser.Physics.Arcade.Sprite).destroy()
        this.coinCount++
      },
    )
  }

  private setupInput(): void {
    this.input.keyboard?.on('keydown-SPACE', () => this.handleJump())
    this.input.keyboard?.on('keydown-UP', () => this.handleJump())
    this.input.on('pointerdown', () => this.handleJump())
  }

  private handleJump(): void {
    if (!this.isGameOver) this.player.jump()
  }

  private setupHUD(): void {
    this.scoreText = this.add
      .text(16, 16, 'SCORE: 0', {
        fontSize: '24px',
        color: '#ffd700',
        fontStyle: 'bold',
      })
      .setDepth(10)

    const hiScore = getHighScore()
    this.add
      .text(GAME_WIDTH - 16, 16, `BEST: ${hiScore}`, {
        fontSize: '18px',
        color: '#74b9ff',
      })
      .setOrigin(1, 0)
      .setDepth(10)
  }

  private scheduleNextObstacle(): void {
    if (this.isGameOver) return
    const elapsed = this.time.now - this.startTime
    const interval = getSpawnInterval(elapsed)
    this.time.delayedCall(interval, () => {
      if (!this.isGameOver) {
        this.obstacleGroup.spawnRandom()
        this.scheduleNextObstacle()
      }
    })
  }

  private scheduleCoin(): void {
    const delay = Phaser.Math.Between(3000, 6000)
    this.time.delayedCall(delay, () => {
      if (!this.isGameOver) {
        this.coinGroup.spawn()
        this.scheduleCoin()
      }
    })
  }

  private triggerGameOver(): void {
    if (this.isGameOver) return
    this.isGameOver = true
    const isNewRecord = this.score > 0 && this.score > getHighScore()
    saveHighScore(this.score)
    this.player.playDeath()
    this.cameras.main.shake(300, 0.015)
    this.time.delayedCall(800, () => {
      this.scene.start(SCENE_KEYS.GAME_OVER, { score: this.score, isNewRecord })
    })
  }
}
