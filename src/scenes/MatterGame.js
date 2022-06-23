//import Phaser from "phaser";

var puk;
var pusher1;
var pusher2;
var scorePlayer1 = 0;
var scorePlayer2 = 0;
var socket = io();
var setScore = true;
var noDrag;
var canDrag;

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
    noDrag = this.matter.world.nextGroup();

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

    canDrag = this.matter.world.nextGroup();
    pusher1 = this.matter.add.image(250, 600, "pusher1");

    pusher1.setBody({
      type: "circle",
      radius: 60,
    });

    pusher1.setMass(40);
    //pusher1.setAngularVelocity(0);
    //pusher.setRotation(0);
    if (pusher1.y > 350 || pusher1.y < 700) {
      pusher1.setCollisionGroup(canDrag);
    } else {
      pusher1.setCollisionGroup(noDrag);
    }

    pusher1.setBounce(0.1);
    pusher1.setFriction(0.3, 0, 0);

    pusher2 = this.matter.add.image(250, 100, "pusher2");

    pusher2.setBody({
      type: "circle",
      radius: 60,
    });

    pusher2.setMass(40);
    // pusher2.setAngularVelocity(0);
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
    //Turn off angular velocity Pusher 1 + 2
    pusher1.setAngularVelocity(0);
    pusher2.setAngularVelocity(0);

    restrictMoveAreaPusher1();
    restrictMoveAreaPusher2();

    // setTimeout(function () {
    //   console.log("Update");
    // }, 500);
    //console.log(pusher1.y);

    //Goal Detection + Reset Puk + Pusher
    if (puk.y <= -30 && setScore) {
      setScore = false;
      // pusher1.setCollisionGroup(noDrag);
      // pusher2.setCollisionGroup(noDrag);
      resetGame();
      scorePlayer1++;
      $("#team1").html(scorePlayer1);
      //socket.emit("set score1", scorePlayer1);
      //scorePlayer1++;
      //console.log(scorePlayer1);
    } else if (puk.y >= 730 && setScore) {
      setScore = false;
      //socket.emit("set score2", scorePlayer2++);
      // pusher1.setCollisionGroup(noDrag);
      // pusher2.setCollisionGroup(noDrag);
      resetGame();
      scorePlayer2++;
      $("#team2").html(scorePlayer2);
    }

    socket.emit("set score", scorePlayer1, scorePlayer2);

    socket.on("score", (score1, score2) => {
      scorePlayer1 = score1;
      scorePlayer2 = score2;
      //console.log("test");
      $("#team1").html(scorePlayer1);
      $("#team2").html(scorePlayer2);
    });
    // socket.on("score1", (score1) => {
    //   console.log("socket:" + score1);
    //   //$("#team1").html(score1);
    // });

    // socket.on("score2", (score2) => {
    //   $("#team2").html(score2);
    // });
    console.log("velocity:" + puk.body.angularVelocity);
    //Position Puk WebSocket
    socket.emit(
      "puk moved",
      puk.x,
      puk.y,
      puk.body.velocity.x,
      puk.body.velocity.y,
      puk.body.angularVelocity
    );
    socket.on("puk position", (posX, posY, velX, velY, angVel) => {
      puk.x = posX;
      puk.y = posY;
      puk.body.velocity.x = velX;
      puk.body.velocity.y = velY;
      puk.body.angularVelocity = angVel;
      //console.log("puk moved");
      // puk.setAngularVelocity(angVel);
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
    pusher1.x = 250;
    pusher1.y = 600;
    pusher1.setAngularVelocity(0);
    pusher1.setVelocity(0);
    pusher2.x = 250;
    pusher2.y = 100;
    pusher2.setAngularVelocity(0);
    pusher2.setVelocity(0);
    // pusher1.setCollisionGroup(canDrag);
    // pusher2.setCollisionGroup(canDrag);
    setScore = true;
  }, 500);
}

function restrictMoveAreaPusher1() {
  //restrict move radius pusher1 top
  if (pusher1.y > 350) {
    pusher1.setCollisionGroup(canDrag);
  } else {
    pusher1.setCollisionGroup(-1);
    pusher1.y = 350;
  }
  //restrict move radius pusher1 bottom
  if (pusher1.y <= 700) {
    pusher1.setCollisionGroup(canDrag);
  } else {
    pusher1.setCollisionGroup(noDrag);
    pusher1.y = 700;
  }
}

function restrictMoveAreaPusher2() {
  //restrict move radius pusher2 top
  if (pusher2.y >= 0) {
    pusher2.setCollisionGroup(canDrag);
  } else {
    pusher2.setCollisionGroup(noDrag);
    pusher2.y = 0;
  }
  //restrict move radius pusher2 bottom
  if (pusher2.y <= 350) {
    pusher2.setCollisionGroup(canDrag);
  } else {
    pusher2.setCollisionGroup(noDrag);
    pusher2.y = 350;
  }
}
