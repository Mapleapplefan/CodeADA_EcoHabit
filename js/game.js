const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: { 
      debug: false,
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
let squi;
let cursors;
let mapImage;
let enteredHouse = false;


const game = new Phaser.Game(config);

function preload() {
  // JUST load the map as a simple image - NO tilemap stuff
  this.load.image('map', 'assets/tilemaps/map.png');
  
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


  //for finding spots on the map
  this.input.on('pointerdown', (pointer) => {
  console.log('x:', pointer.worldX, 'y:', pointer.worldY);
});
  
  // Create player
  player = this.physics.add.sprite(500, mapImage.height - 200,  'player');
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
  
  // console.log('✅ Map loaded as image:', mapImage.width, 'x', mapImage.height);
  createCollisions(this);
  //Collisions
}

function createCollisions(scene) {
  const houseZone =  scene.add.rectangle(569, 2130, 250, 200, 0x00ff00, 0.3);
  scene.physics.add.existing(houseZone, true);
  houseZone.setStrokeStyle(2, 0x00ff00); // outline for visibility
  scene.physics.add.overlap(player, houseZone, openPopup, null, this);
  scene.physics.add.collider(player, houseZone, enterHouse, null, scene);

}

function enterHouse(player, houseZone) {
  if (enteredHouse) return; // prevent repeat triggers
  enteredHouse = true;
  player.body.setVelocity(0);
  // Optional fade-out before switching
  player.scene.cameras.main.fadeOut(800, 0, 0, 0);

  player.scene.time.delayedCall(800, () => {
    player.scene.scene.start('HouseScene'); // must exist
  });
}

function openPopup() {
  console.log("🦝 You reached the house!");
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



class HouseScene extends Phaser.Scene {

  preload() {
    
    this.load.image('house', 'assets/tilesets/SquirrelHouse.png');
    this.load.spritesheet('squi', 'assets/sprites/squirrel.png', {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create() {
    // ESC to return
    this.input.keyboard.once('keydown-ESC', () => {
    this.scene.start('default'); // "default" = your main unnamed scene
    });
    // mapImage = this.add.image(0, 0, 'map').setOrigin(0, 0);
    const scale = 3;
const houseImage = this.add.image(0, 0, 'house').setOrigin(0, 0).setScale(scale);
this.physics.world.setBounds(0, 0, houseImage.width * scale, houseImage.height * scale);
this.cameras.main.setBounds(0, 0, houseImage.width * scale, houseImage.height * scale);



  //for finding spots on the map
  this.input.on('pointerdown', (pointer) => {
  console.log('x:', pointer.worldX, 'y:', pointer.worldY);
});
    ////
    // Create squi
 squi = this.physics.add.sprite(574, 250,  'squi');
 squi.setScale(3);
 squi.setCollideWorldBounds(true);

 
  this.anims.create({
    key: 'walk',
    frames: this.anims.generateFrameNumbers('squi', { start: 16, end: 23 }),
    frameRate: 10,
    repeat: 0
  });

if (!this.anims.exists('tail')) {
  this.anims.create({
    key: 'tail',
    frames: this.anims.generateFrameNumbers('squi', { start: 0, end: 5 }),
    frameRate: 6,
    repeat: -1
  });
  }

  // Camera follows squi
  this.cameras.main.startFollow(squi);
  this.cameras.main.setZoom(0.7)
  
  // Keyboard controls
  cursors = this.input.keyboard.createCursorKeys();
  
  // console.log('✅ Map loaded as image:', mapImage.width, 'x', mapImage.height);
  createCollisions(this);
}

  update() {

  const speed = 200;
  let moving = false; // Track if any key is pressed

 squi.setVelocity(0);

  // Horizontal movement
  if (cursors.left.isDown) {
   squi.setVelocityX(-speed);
    squi.flipX = true;
    moving = true;
  } 
  else if (cursors.right.isDown) {
    squi.setVelocityX(speed);
    squi.flipX = false;
    moving = true;
  }

  // Vertical movement
  if (cursors.up.isDown) {
    squi.setVelocityY(-speed);
    moving = true;
  } 
  else if (cursors.down.isDown) {
    squi.setVelocityY(speed);
    moving = true;
  }

  // Animation handling
  if (moving) {
    squi.anims.play('walk', true);
  } else {
    squi.anims.play('tail', true);
  }
}


}

game.scene.add('HouseScene', HouseScene);

window.addEventListener('unhandledrejection', e => {
    if (e.reason && e.reason.stack && e.reason.stack.includes('content_script.js')) {
        e.preventDefault();
        console.warn('Ignored extension promise error:', e.reason);
    }
});

// Catch all uncaught errors
window.addEventListener('error', (event) => {
    // Check if the error comes from a browser extension
    if (event.filename && event.filename.includes('content_script.js')) {
        // Ignore the error
        event.preventDefault();   // Stop it from propagating
        console.warn('Ignored extension error:', event.message);
        return false;
    }

    // Otherwise, let the error propagate normally
});

