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
  this.load.tilemapTiledJSON('map', 'assets/tilemaps/map.tmj');

  // Load all the tileset images that your map uses
  this.load.image('building', 'assets/tilesets/building.png');
  this.load.image('main', 'assets/tilesets/Courtyard.png');
  this.load.image('Roads', 'assets/tilesets/Roads.png');

  // Load your player sprite
  this.load.spritesheet('player', 'assets/sprites/player.png', {
    frameWidth: 32,
    frameHeight: 32
  });
}

function create() {
  const map = this.make.tilemap({ key: 'map' });

  // Add all the tilesets the map expects
  const buildingTiles = map.addTilesetImage('building', 'building');
  const mainTiles = map.addTilesetImage('main', 'main');
  const roadsTiles = map.addTilesetImage('Roads', 'Roads');

  // Combine them into one array (so Phaser can use them across layers)
  const allTiles = [buildingTiles, mainTiles, roadsTiles];

  // Create each layer by its name in Tiled
  const groundLayer = map.createLayer('ground', allTiles, 0, 0);
  const buildingLayer = map.createLayer('building', allTiles, 0, 0);
  const treesLayer = map.createLayer('trees', allTiles, 0, 0);

  // Add player and controls
  player = this.physics.add.sprite(100, 100, 'player');
  player.setCollideWorldBounds(true);
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  player.setVelocity(0);

  if (cursors.left.isDown) player.setVelocityX(-100);
  else if (cursors.right.isDown) player.setVelocityX(100);

  if (cursors.up.isDown) player.setVelocityY(-100);
  else if (cursors.down.isDown) player.setVelocityY(100);
}