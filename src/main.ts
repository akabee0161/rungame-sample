import Phaser from 'phaser'
import { Boot } from './scenes/Boot'
import { Preload } from './scenes/Preload'
import { Game } from './scenes/Game'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  backgroundColor: '#1a1a2e',
  scene: [Boot, Preload, Game],
}

new Phaser.Game(config)
