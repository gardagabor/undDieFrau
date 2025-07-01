import Phaser from 'phaser';
import GameScene from './scenes/GameScene.ts';
import './style.css';

const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 700,
  parent: 'game-container',  // This must match your div id
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);
