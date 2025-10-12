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
  // this.load.spritesheet('player', 'assets/sprites/player.png', {
  //   frameWidth: 32,
  //   frameHeight: 32
  // });
  this.load.spritesheet('player', 'assets/sprites/squirrel.png', {
        frameWidth: 32, 
        frameHeight: 32
  });
}

function create() {
//Map stuff
  // SIMPLE: Just add the map as a background image
  mapImage = this.add.image(0, 0, 'map').setOrigin(0, 0);
  
  // Set bounds to the actual image size
  this.physics.world.setBounds(0, 0, mapImage.width, mapImage.height);
  this.cameras.main.setBounds(0, 0, mapImage.width, mapImage.height);

  
  // Create player
  player = this.physics.add.sprite(500,                 
  mapImage.height - 200,  'player');
  player.setScale(3);
  player.setCollideWorldBounds(true);

  // Tail wag
    this.anims.create({
        key: 'tail',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
        frameRate: 6,
        repeat: -1
    });
    
    // Jumping
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('player', { start: 16, end: 23 }),
        frameRate: 10,
        repeat: 0
    });
  
  // Camera follows player
  this.cameras.main.startFollow(player);
  this.cameras.main.setZoom(0.7)
  
  // Keyboard controls
  cursors = this.input.keyboard.createCursorKeys();
  
  console.log('✅ Map loaded as image:', mapImage.width, 'x', mapImage.height);
}

function update() {
  const speed = 200;
  let moving = false; // Track if any key is pressed

  player.setVelocity(0);

  // Horizontal movement
  if (cursors.left.isDown) {
    player.setVelocityX(-speed);
    player.flipX = true;
    moving = true;
  } 
  else if (cursors.right.isDown) {
    player.setVelocityX(speed);
    player.flipX = false;
    moving = true;
  }

  // Vertical movement
  if (cursors.up.isDown) {
    player.setVelocityY(-speed);
    moving = true;
  } 
  else if (cursors.down.isDown) {
    player.setVelocityY(speed);
    moving = true;
  }

  // Animation handling
  if (moving) {
    player.anims.play('walk', true);
  } else {
    player.anims.play('tail', true);
  }
  
}
