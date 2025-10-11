const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container', // ⬅️ mount inside div
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: {
    preload,
    create,
    update
  }
};

let player;
let cursors;

const game = new Phaser.Game(config);

function preload() {
  // Example assets — replace with your own later
  this.load.image('tiles', 'assets/tilesets/tileset.png');
  this.load.tilemapTiledJSON('map', 'assets/tilemaps/map.json');
  this.load.spritesheet('player', 'assets/sprites/player.png', {
    frameWidth: 32,
    frameHeight: 32
  });
}

function create() {
  // Load tilemap
  const map = this.make.tilemap({ key: 'map' });
  const tileset = map.addTilesetImage('tilesetNameInTiled', 'tiles');
  const layer = map.createLayer('Tile Layer 1', tileset, 0, 0);

  // Add player
  player = this.physics.add.sprite(100, 100, 'player', 0);
  player.setCollideWorldBounds(true);

  // Add arrow key controls
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  player.setVelocity(0);

  if (cursors.left.isDown) player.setVelocityX(-100);
  else if (cursors.right.isDown) player.setVelocityX(100);

  if (cursors.up.isDown) player.setVelocityY(-100);
  else if (cursors.down.isDown) player.setVelocityY(100);
}