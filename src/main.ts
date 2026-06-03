import Phaser from 'phaser'
import { Boot } from './scenes/Boot'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  backgroundColor: '#1a1a2e',
  scene: [Boot],
}

new Phaser.Game(config)
