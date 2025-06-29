import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Phaser.Types.Input.Keyboard.CursorKeys;
  private speed: number = 200;

  constructor() {
    super('GameScene');
  }

  create() {
    this.player = this.add.rectangle(400, 300, 50, 50, 0xffffff);

    // Create cursor keys input
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Create WASD keys input
    this.wasd = this.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Phaser.Types.Input.Keyboard.CursorKeys;
  }

  update(time: number, delta: number) {
    const playerSpeed = this.speed * (delta / 1000);
    let moveX = 0;
    let moveY = 0;

    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      moveX -= playerSpeed;
    }
    if (this.cursors.right.isDown || this.wasd.right.isDown) {
      moveX += playerSpeed;
    }
    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      moveY -= playerSpeed;
    }
    if (this.cursors.down.isDown || this.wasd.down.isDown) {
      moveY += playerSpeed;
    }

    this.player.x = Phaser.Math.Clamp(this.player.x + moveX, 25, 800 - 25);
    this.player.y = Phaser.Math.Clamp(this.player.y + moveY, 25, 600 - 25);
  }
}
