//import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  preload() {
    this.load.image("puk", "./assets/Puk.png");
    this.load.image("pusher", "./assets/Pusher.png");
  }
  create() {
    // var puk = this.physics.add.sprite(200, 200, "red");
    // puk.setVelocity(100, 100);
    // puk.setBounce(1);
    // puk.setCollideWorldBounds(true);
    var puk = this.physics.add.image(100, 240, "puk");
    puk.setCircle(30);
    puk.setCollideWorldBounds(true);
    puk.setBounce(1);
    puk.setVelocity(150, 150);

    var pusher = this.physics.add.image(250, 600, "pusher").setInteractive();
    pusher.setCircle(60);
    pusher.setCollideWorldBounds(true);
    this.input.setDraggable(pusher);
    // pusher.setBounce(1);
    // pusher.setMass(500);

    this.physics.add.collider(puk, pusher, changeVelocity);

    // this.input.on(
    //   "pointermove",
    //   function (pointer) {
    //     pusher.x = pointer.x;
    //     pusher.y = pointer.y;
    //   },
    //   this
    // );

    this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });
    // this.physics.add.overlap(puk, pusher, changeDirection, null, this);
  }
  update() {}
}
