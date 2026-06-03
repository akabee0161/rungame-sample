// src/main.ts
import Phaser from 'phaser'
import { Boot } from './scenes/Boot'
import { Preload } from './scenes/Preload'
import { Title } from './scenes/Title'
import { Game } from './scenes/Game'
import { GameOver } from './scenes/GameOver'
import { GAME_WIDTH, GAME_HEIGHT, GRAVITY } from './constants'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#0a0a2e',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: GRAVITY, x: 0 }, debug: false },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Boot, Preload, Title, Game, GameOver],
}

new Phaser.Game(config)
