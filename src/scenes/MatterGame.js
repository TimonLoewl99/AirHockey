//import Phaser from "phaser";

var puk;
var pusher1;
var pusher2;
var scorePlayer1 = 0;
var scorePlayer2 = 0;
var socket = io();

export default class Game extends Phaser.Scene {
  preload() {
    this.load.image("puk", "./assets/Puk.png");
    this.load.image("pusher1", "./assets/Pusher1.png");
    this.load.image("pusher2", "./assets/Pusher2.png");
    this.load.image("background", "./assets/Spielfeld.png");
  }
  create() {
    socket.emit("connection");

    this.add.image(250, 350, "background");
    // var scoreText = this.add.text(0, 0, "Hallo", {
    //   fontSize: "32px",
    //   color: "green",
    //   fontStyle: "bold",
    // });

    //world settings
    // this.matter.world.setBounds().disableGravity();
    this.matter.world.disableGravity();

    //borders
    var noDrag = this.matter.world.nextGroup();

    var leftBorder = this.matter.add.rectangle(0, 0, 1, 1400, {
      isStatic: true,
    });
    var rightBorder = this.matter.add.rectangle(500, 0, 1, 1400, {
      isStatic: true,
    });
    var topLeft = this.matter.add.rectangle(0, 0, 350, 1, {
      isStatic: true,
    });
    var topRight = this.matter.add.rectangle(500, 0, 350, 1, {
      isStatic: true,
    });
    var bottomLeft = this.matter.add.rectangle(0, 700, 350, 1, {
      isStatic: true,
    });
    var bottomRight = this.matter.add.rectangle(500, 700, 350, 1, {
      isStatic: true,
    });

    // leftBorder.setBody({
    //   fillStyle: "red",
    //   strokeStyle: "blue",
    //   lineWidth: 3,
    // });

    puk = this.matter.add.image(250, 350, "puk");
    //  Change the body of puck to a circle with a radius of 30px
    puk.setBody({
      type: "circle",
      radius: 30,
    });

    // //  Just make the body move around and bounce
    // puk.setVelocity(0, 3);
    puk.setAngularVelocity(0.01);
    puk.setBounce(0.7);
    puk.setFriction(0.05, 0, 0);
    puk.setMass(5);
    puk.setCollisionGroup(noDrag);

    var canDrag = this.matter.world.nextGroup();
    pusher1 = this.matter.add.image(250, 600, "pusher1");

    pusher1.setBody({
      type: "circle",
      radius: 60,
    });

    pusher1.setMass(40);
    pusher1.setAngularVelocity(0);
    //pusher.setRotation(0);
    pusher1.setCollisionGroup(canDrag);
    pusher1.setBounce(0.1);
    pusher1.setFriction(0.3, 0, 0);

    pusher2 = this.matter.add.image(250, 100, "pusher2");

    pusher2.setBody({
      type: "circle",
      radius: 60,
    });

    pusher2.setMass(40);
    pusher2.setAngularVelocity(0);
    //pusher.setRotation(0);
    pusher2.setCollisionGroup(canDrag);
    pusher2.setBounce(0.1);
    pusher2.setFriction(0.3, 0, 0);

    // pusher.input.on("drag", function (dragX, dragY) {
    //   pusher.x = dragX;
    //   pusher.y = dragY;
    // });

    // this.matter.add.mouseSpring();

    this.matter.add.mouseSpring({
      collisionFilter: { group: canDrag },
    });

    // this.matter.add.mouseSpring({
    //   length: 1,
    //   stiffness: 0.6,
    //   collisionFilter: { group: canDrag },
    // });
  }

  update() {
    if (puk.y < -30) {
      resetGame();
      scorePlayer1++;
    }

    if (puk.y > 730) {
      resetGame();
      scorePlayer2++;
    }

    //Position Puk WebSocket
    socket.emit(
      "puk moved",
      puk.x,
      puk.y
      // puk.body.velocity,
      // puk.body.angularVelocity
    );
    socket.on("puk position", (posX, posY) => {
      puk.x = posX;
      puk.y = posY;
      // puk.setVelocity(velocity);
      // puk.setAngularVelocity(angularVelocity);
    });

    //Position Pusher1 WebSocket
    socket.emit("pusher1 moved", pusher1.x, pusher1.y);
    socket.on("pusher1 position", (posX, posY) => {
      pusher1.x = posX;
      pusher1.y = posY;
    });

    //Position Pusher1 WebSocket
    socket.emit("pusher2 moved", pusher2.x, pusher2.y);
    socket.on("pusher2 position", (posX, posY) => {
      pusher2.x = posX;
      pusher2.y = posY;
    });
  }
}

function resetGame() {
  setTimeout(function () {
    puk.x = 250;
    puk.y = 350;
    puk.setAngularVelocity(0.01);
    puk.setVelocity(0);
    //pusher1.setCollisionGroup(noDrag);
    //pusher2.setCollisionGroup(noDrag);
    pusher1.x = 250;
    pusher1.y = 600;
    pusher1.setAngularVelocity(0);
    pusher1.setVelocity(0);
    pusher2.x = 250;
    pusher2.y = 100;
    pusher2.setAngularVelocity(0);
    pusher2.setVelocity(0);
  }, 500);
}
