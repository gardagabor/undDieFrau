import Phaser from 'phaser';

const DEFAULT_PLAYER_X = 900;
const DEFAULT_PLAYER_Y = 400;
const REGISTRY_PLAYER_X = 'playerX';
const REGISTRY_PLAYER_Y = 'playerY';
const COLLISION_START = 807;
const COLLISION_END = 1000;

export default class GameScene extends Phaser.Scene {
  private music!: Phaser.Sound.BaseSound;
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Phaser.Types.Input.Keyboard.CursorKeys;
  private speed: number = 100;

  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('player', 'assets/player.png');
    this.load.tilemapTiledJSON('map', 'assets/map_6.json');
    this.load.image('TilesetFloor', 'assets/TilesetFloor.png');
    this.load.image('TilesetNature', 'assets/TilesetNature.png');
    this.load.audio('bgm', 'assets/music/bela.wav');
  }

  create() {
    this.cameras.main.setZoom(2);

    this.initMusic();

    const { treesLayer, map } = this.initMapAndLayers();

    this.initPlayerLocation();

    this.setCollision(treesLayer);

    this.setCamera(map); // smooth but snappy

    this.initCursors();

    this.setSceneChange();
  }

  update() {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const velocity = new Phaser.Math.Vector2(0, 0);

    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      velocity.x = -1;
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      velocity.x = 1;
    }

    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      velocity.y = -1;
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      velocity.y = 1;
    }

    velocity.normalize().scale(this.speed);
    body.setVelocity(velocity.x, velocity.y);
  }

  // Manage music instance via game-level property to persist between scenes
  private initMusic(): void {
    // Use a singleton attached to the Phaser.Game instance to persist music
    if (!('bgmMusic' in this.game)) {
      const music = this.sound.add('bgm', { loop: true, volume: 0.5 });
      music.play();
      (this.game as any).bgmMusic = music;
      this.music = music;
    } else {
      this.music = (this.game as any).bgmMusic as Phaser.Sound.BaseSound;
      if (this.music.isPaused) {
        this.music.resume();
      } else if (!this.music.isPlaying) {
        this.music.play();
      }
    }
  }

  // Initialize player location using registry or defaults
  private initPlayerLocation(): void {
    const savedX = this.registry.get(REGISTRY_PLAYER_X);
    const savedY = this.registry.get(REGISTRY_PLAYER_Y);

    const playerX = typeof savedX === 'number' ? savedX : DEFAULT_PLAYER_X;
    const playerY = typeof savedY === 'number' ? savedY : DEFAULT_PLAYER_Y;

    this.player = this.physics.add.sprite(playerX, playerY, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setOrigin(0.5, 0.5);
  }

  private setSceneChange(): void {
    this.input.keyboard!.on('keydown-SPACE', () => {
      this.registry.set(REGISTRY_PLAYER_X, this.player.x);
      this.registry.set(REGISTRY_PLAYER_Y, this.player.y);
      this.music.pause();
      this.scene.start('FightScene');
    });
  }

  private initCursors(): void {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Phaser.Types.Input.Keyboard.CursorKeys;
  }

  private setCamera(map: Phaser.Tilemaps.Tilemap): void {
    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.2, 0.2);
  }

  private setCollision(treesLayer: Phaser.Tilemaps.TilemapLayer | null): void {
    if (!treesLayer) {
      throw new Error('Trees layer not found for collision setup.');
    }
    treesLayer.setCollisionBetween(COLLISION_START, COLLISION_END);
    this.physics.add.collider(this.player, treesLayer);
  }

  private initMapAndLayers(): { treesLayer: Phaser.Tilemaps.TilemapLayer, map: Phaser.Tilemaps.Tilemap } {
    const map = this.make.tilemap({ key: 'map' });
    const tilesetFloor = map.addTilesetImage('TilesetFloor', 'TilesetFloor');
    const tilesetNature = map.addTilesetImage('TilesetNature', 'TilesetNature');

    if (!tilesetFloor || !tilesetNature) {
      throw new Error('Tilesets missing.');
    }

    map.createLayer('Floor', tilesetFloor, 0, 0);
    const treesLayer = map.createLayer('Trees', tilesetNature, 0, 0);

    if (!treesLayer) {
      throw new Error("Layer 'Trees' not found!");
    }

    return { treesLayer, map };
  }
}