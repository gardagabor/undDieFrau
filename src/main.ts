import Phaser from 'phaser';
import GameScene from './scenes/GameScene.ts';
import FightScene from './scenes/FightScene.ts';
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
  pixelArt: true,
  scene: [GameScene, FightScene],

  scale: {
    mode: Phaser.Scale.FIT,             // Scale to fit while maintaining aspect ratio
    autoCenter: Phaser.Scale.CENTER_BOTH, // Center horizontally and vertically
    width: 1200,
    height: 700,
  },
};

const game = new Phaser.Game(config);
