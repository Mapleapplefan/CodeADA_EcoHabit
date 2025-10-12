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
let carbonFootprint = 67;
let guideLine;
let completedCount = 0;


const game = new Phaser.Game(config);

function preload() {
  // JUST load the map as a simple image - NO tilemap stuff
  this.load.image('map', 'assets/tilemaps/map.png');
  
  this.load.spritesheet('player', 'assets/sprites/squirrel.png', {
        frameWidth: 32, 
        frameHeight: 32
  });

    // this.load.image('bike', 'assets/sprites/bike.png');
    // this.load.image('car', 'assets/sprites/car.png');
    // this.load.image('bus', 'assets/sprites/bus.png');
}

function create() {
enteredHouse = false;
//Map stuff
  // SIMPLE: Just add the map as a background image
  mapImage = this.add.image(0, 0, 'map').setOrigin(0, 0);
  
  // Set bounds to the actual image size
  this.physics.world.setBounds(0, 0, mapImage.width, mapImage.height);
  this.cameras.main.setBounds(0, 0, mapImage.width, mapImage.height);


//   //creating statis vechnicles 
//     const bike = scene.add.image(680, 2400, 'bike').setOrigin(0.5).setScale(3);

//     // Add car sprite
//     const car = scene.add.image(680, 2450,, 'car').setOrigin(0.5).setScale(3);

//     // Add bus sprite
//     const bus = scene.add.image(600, 2500, 'bus').setOrigin(0.5).setScale(3);

  //for finding spots on the map
  this.input.on('pointerdown', (pointer) => {
  console.log('x:', pointer.worldX, 'y:', pointer.worldY);
});
  
  // Create player
  player = this.physics.add.sprite(3500, 1300, 'player');
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

  //task bar
  const tasks = ["[X] Buy Groceries from Shop", "[X] Do laundry at home", "[X] Bathe at home" ];
    createTaskBar(this, tasks);
}


  function showQuestion(scene, questionText, answers, callback) {
    const cam = scene.cameras.main;
    const centerX = cam.scrollX + cam.centerX;
    const centerY = cam.scrollY + cam.centerY;

    // Dark overlay covering the screen
    const overlay = scene.add.rectangle(centerX, centerY, cam.width, cam.height, 0x000000, 0.5);

  // Popup box
    const box = scene.add.rectangle(centerX, centerY, 500, 300, 0xffffff, 1).setStrokeStyle(2, 0x000000);

    // Question text
    const question = scene.add.text(centerX, centerY - 60, questionText, {
        fontSize: '24px',
        color: '#000',
        wordWrap: { width: 450 }
    }).setOrigin(0.5);

    // Buttons
    const buttonYStart = centerY;
    const buttons = [];

    answers.forEach((answer, index) => {
        const btn = scene.add.text(centerX, buttonYStart + index * 50, answer, {
        fontSize: '20px',
        backgroundColor: '#6ecd87ff',
        color: '#000',
        padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerdown', () => {
        container.destroy(); // remove popup
        callback(answer);    // handle answer
        });

        buttons.push(btn);
    });

    // Add everything to a container
    const container = scene.add.container(0, 0, [overlay, box, question, ...buttons]);
    player.body.enable = false;
}

function createGuideLine(scene, player, targetZone) {
    // Create graphics object once
    guideLine = scene.add.graphics();

    const updateHandler = () => {
        if (!guideLine) return;

        // If player overlaps store, remove line and stop updating
        if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), targetZone.getBounds())) {
            guideLine.destroy();
            guideLine = null;
            console.log("MADE IT TO THEW SOTORE");
            // Remove this listener to prevent future calls
            scene.events.off('update', updateHandler);
            return;
        }

        // Clear previous line
        guideLine.clear();

        // Draw line from player center to store center
        const targetCenter = targetZone.getCenter();
        guideLine.lineStyle(2, 0xff0000, 1);
        guideLine.beginPath();
        guideLine.moveTo(player.x, player.y);
        guideLine.lineTo(targetCenter.x, targetCenter.y);
        guideLine.strokePath();
        guideLine.closePath();
    };

    // Add the listener
    scene.events.on('update', updateHandler);
}

function game_end(scene) {
    // Example: go to a ResultsScene or show overlay
    console.log("end scene");
    scene.scene.start('ResultsScene', { carbonFootprint: carbonFootprint });
}


function createTaskBar(scene, tasks) {
    // Create a container for the task bar
    const taskBar = scene.add.container(0, 0);
    
    // Panel background
    const panelWidth = 400;
    const panelHeight = tasks.length * 40 + 20;
    const panel = scene.add.rectangle(
        scene.cameras.main.width - 50,
        -30, 
        panelWidth, 
        panelHeight, 
        0x222222, 
        0.8
    );
    panel.setStrokeStyle(2, 0xffffff);
    panel.setOrigin(0.5);
    
    // Fix to camera so it doesn't move with world
    panel.setScrollFactor(0);
    taskBar.add(panel);
    // Add task buttons
    tasks.forEach((task, i) => {
    const btn = scene.add.text(
        scene.cameras.main.width - 200,
        -85 + i * 40,
        task,
        { fontSize: '16px', color: '#ffffff', backgroundColor: '#555555', padding: { x: 5, y: 5 } }
    )
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
        if (!btn.completed) {            // prevent double-counting
            btn.completed = true;
            console.log(`Task "${task}" completed!`);
            btn.setStyle({ color: '#aaaaaa', backgroundColor: '#333333' });
            completedCount++;

            // Check if all tasks are done
            if (completedCount === tasks.length) {
                game_end(scene);
            }
        }
    });

    btn.setScrollFactor(0);
    taskBar.add(btn);
});


    if (completedCount == 3) {
        game_end(scene);
    }

    return taskBar;
}



function createCollisions(scene) {

//house collision
  const houseZone =  scene.add.rectangle(3500, 1150, 250, 200, 0x00ff00, 0.3);
  scene.physics.add.existing(houseZone, true);
  houseZone.setStrokeStyle(2, 0x00ff00); // outline for visibility
  scene.physics.add.overlap(player, houseZone, openPopup, null, this);
  scene.physics.add.collider(player, houseZone, enterHouse, null, scene);

//transportation collision x: 3652.857194165795 y: 1312.8571652149672 
const transportationq = scene.add.rectangle(3700, 1400, 80, 300, 0x00ff00, 0.3);
  scene.physics.add.existing(transportationq, true);
  transportationq.setStrokeStyle(2, 0x00ff00); // outline for visibility
  scene.physics.add.overlap(player, transportationq, () => {
    // Disable player movement while popup is open
    player.body.enable = false;

    console.log("before: " + carbonFootprint);
    showQuestion(scene, "Transportation?", ["Car", "Bike", "Walk", "Bus"], (answer) => {
      console.log("Player selected:", answer);
    if (answer == "Car"){
        carbonFootprint += 	1,600;
    } else if (answer == "Bike"  || answer == "Walk"){
        carbonFootprint += 0;
    } else {
        carbonFootprint += 82
    }
    console.log("after" + carbonFootprint);
    // //creating guideline
    // storeZone = scene.add.rectangle(2507, 2159, 100, 100, 0x0000ff, 0.3);
    // scene.physics.add.existing(storeZone, true);
    // storeZone.setStrokeStyle(2, 0x00ff00); // outline for visibility
    // createGuideLine(scene, player, storeZone);
    

      // Re-enable movement after selecting
      player.body.enable = true;
    // bike.destroy();
    // car.destroy();
    // bus.destroy();
      // Optional: remove collision zone so it doesn't trigger again
      transportationq.destroy();
    });

    


    showQuestion(scene, "Where to go?", ["Shop"], (answer) => {
    console.log("Player selected:", answer);
    if (answer == "Shop"){
        //creating guideline ignore x: 6274.57152452761 y: 2830.952429163219
        storeZone = scene.add.rectangle(6300, 2890, 100, 100, 0x0000ff, 0.3);
        scene.physics.add.existing(storeZone, true);
        storeZone.setStrokeStyle(2, 0x00ff00); // outline for visibility
        createGuideLine(scene, player, storeZone);
    } 
    });

  }, null, scene);
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

//   //update guideline
//   createGuideLine(scene, player, storeZone);
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
    const scale = 3.5;
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
 squi.setScale(5);
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


class ResultsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ResultsScene' });
    }

    init(data) {
        // `data` comes from scene.start('ResultsScene', { carbonFootprint })
        this.carbonFootprint = data.carbonFootprint || 0;
    }

    preload() {
        // Load any assets for the results screen if needed
        // e.g., background image, icons, etc.
    }

    create() {
        const cam = this.cameras.main;
        const centerX = cam.centerX;
        const centerY = cam.centerY;

        // Background
        this.add.rectangle(centerX, centerY, cam.width, cam.height, 0x222222, 0.9);

        // Title text
        this.add.text(centerX, centerY - 100, 'Game Finished!', {
            fontSize: '48px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Carbon footprint result
        this.add.text(centerX, centerY, `Your carbon footprint: ${this.carbonFootprint}`, {
            fontSize: '32px',
            color: '#ffcc00'
        }).setOrigin(0.5);

        // Optional: restart button
        const restartBtn = this.add.text(centerX, centerY + 100, 'Play Again', {
            fontSize: '28px',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        restartBtn.on('pointerdown', () => {
            this.scene.start('default'); // go back to main scene
        });
    }
}

// Add the scene to the game
game.scene.add('ResultsScene', ResultsScene);

