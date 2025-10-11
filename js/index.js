import Phaser from 'phaser';
import mySheet from "Squirrel Sprite Sheet.png";


class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.spritesheet("Squirrel Sprite Sheet", mySheet, {
            frameWidth: 416,
            frameHeight: 454,
        });
    }

    create ()
    {
        const walk = {
            key: "walk", 
            frames: this.anims.generateFrameNumbers("Squirrel Sprite Sheet", {frames:[16, 17, 18, 19, 20, 21, 22, 23]}),
            frameRate: 16,
            repeat: -1
        }
        this.anims.create(walk)
        
        this.player = this.add.sprite(400, 300, "Squirrel Sprite Sheet");

        this.player.play("walk", true)

    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    debug: true,
    scene: MyGame
};

const game = new Phaser.Game(config);