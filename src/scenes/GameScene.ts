import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Phaser.Types.Input.Keyboard.CursorKeys;
  private speed: number = 200;

  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.tilemapCSV('map', 'assets/map.csv');
    this.load.image('tileset', 'assets/TilesetFloor.png');
    this.load.image('player', 'assets/player.png');
  }

  create() {
    const map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16 });
    const tileset = map.addTilesetImage('TilesetFloor', 'tileset');

    if (!tileset) {
      throw new Error('Tileset not found! Check your tileset name.');
    }

    map.createLayer(0, tileset, 0, 0);

    // Create player sprite and enable physics body
    this.player = this.physics.add.sprite(100, 100, 'player');
    this.player.setOrigin(0.5, 0.5);
    this.player.setScale(0.1);  // scales down to 50%

    if (this.player.body instanceof Phaser.Physics.Arcade.Body) {
      this.player.body.setCollideWorldBounds(true);
    }

    // Set world bounds based on map size
    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    // Camera setup
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Phaser.Types.Input.Keyboard.CursorKeys;
  }

  update(time: number, delta: number) {
    const speed = this.speed;
    let moveX = 0;
    let moveY = 0;

    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      moveX = -speed;
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      moveX = speed;
    }

    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      moveY = -speed;
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      moveY = speed;
    }

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    playerBody.setVelocity(moveX, moveY);
  }
}
