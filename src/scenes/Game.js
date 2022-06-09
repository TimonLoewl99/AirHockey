//import Phaser from "phaser";

var graphics;
var pusher2;

export default class Game extends Phaser.Scene {
  preload() {}
  create() {
    graphics = this.add.graphics();
    // this.add.text(400, 250, "Game");
    const puk = this.add.circle(250, 400, 30, 0xffffff, 1);
    this.physics.add.existing(puk);
    puk.body.setVelocity(300, 300);
    puk.body.setCollideWorldBounds(true, 1, 1);
    puk.body.setBounce(1, 1);

    const pusher1 = this.add.circle(250, 100, 60, 0xffffff, 1).setInteractive();
    // pusher2 = this.add
    //   .circle(250, 700, 60, 0xffffff, 1)
    //   .setStrokeStyle(2, 0xffff00);
    pusher2 = new Phaser.Geom.Circle(250, 600, 60);

    this.physics.add.existing(pusher1, true);
    this.physics.add.existing(pusher2, true);

    this.physics.add.collider(pusher1, puk);
    this.physics.add.collider(pusher2, puk);

    // graphics.lineStyle(2, 0xffff00);

    // graphics = this.add.graphics();

    // this.input.on("pointermove", function (pointer) {
    //   pusher2.x = pointer.x;
    //   pusher2.y = pointer.y;
    // });

    this.input.on(
      "pointermove",
      function (pointer) {
        pusher2.x = pointer.x;
        pusher2.y = pointer.y;
      },
      this
    );
  }

  update() {
    // var pointer = this.input.activePointer;
    // graphics.clear();
    // graphics.lineStyle(1, 0x00ff00, 1);
    // graphics.strokeCircleShape(pusher2);
    // // console.log(pointer.worldX);
    graphics.clear;
  }
}
