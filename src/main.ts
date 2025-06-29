import Phaser from 'phaser';
import GameScene from './scenes/GameScene.ts';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#000000', // black background
  scene: [GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
};

new Phaser.Game(config);