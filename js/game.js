const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: { 
      debug: true,
      gravity: { y: 0 }
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

let player;
let cursors;
let mapImage;

const game = new Phaser.Game(config);

function preload() {
  // JUST load the map as a simple image - NO tilemap stuff
  this.load.image('map', 'assets/tilemaps/map.png');
  
  // Load player (only once - you had it twice)
  this.load.spritesheet('player', 'assets/sprites/player.png', {
    frameWidth: 32,
    frameHeight: 32
  });
}

function create() {
  // SIMPLE: Just add the map as a background image
  mapImage = this.add.image(0, 0, 'map').setOrigin(0, 0);
  
  // Set bounds to the actual image size
  this.physics.world.setBounds(0, 0, mapImage.width, mapImage.height);
  this.cameras.main.setBounds(0, 0, mapImage.width, mapImage.height);
  
  // Create player
  player = this.physics.add.sprite(500,                      // 100px from left edge
  mapImage.height - 200,  'player');
  player.setCollideWorldBounds(true);
  
  // Camera follows player
  this.cameras.main.startFollow(player);
  this.cameras.main.setZoom(0.7)
  
  // Keyboard controls
  cursors = this.input.keyboard.createCursorKeys();
  
  console.log('✅ Map loaded as image:', mapImage.width, 'x', mapImage.height);
}

function update() {
  player.setVelocity(0);

  if (cursors.left.isDown) player.setVelocityX(-160);
  else if (cursors.right.isDown) player.setVelocityX(160);

  if (cursors.up.isDown) player.setVelocityY(-160);
  else if (cursors.down.isDown) player.setVelocityY(160);
}