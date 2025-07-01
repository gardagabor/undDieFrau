import Phaser from 'phaser';

export default class FightScene extends Phaser.Scene {
  constructor() {
    super('FightScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#222244');
    this.cameras.main.setZoom(1);

    // Try a larger font size and add a stroke to make it more visible
    this.add.text(10, 10, 'Test Text - Should be visible', {
      fontSize: '32px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    });

    this.input.keyboard!.on('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
  }
}
