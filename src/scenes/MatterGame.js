//import Phaser from "phaser";
var puk;
var sender = 1;
var pusherState = {
  pusher1: null,
  pusher2: null,
};

var scorePlayer1 = 0;
var scorePlayer2 = 0;
var socket = io();
var setScore = true;
var noDrag;
var canDrag;
var myId = {};
var pusherId = null;
var pusherEvent = "";
var pusherPosition = "";
var myPusher;
var notMyPusher;
var collision;

var pusherData = {
  x: 0,
  y: 0,
  av: 0,
  vx: 0,
  vy: 0,
};

socket.on("*id", function (args) {
  pusherId = args.pusher;
  console.log(pusherId);
  pusherEvent = `pusher${pusherId} moved`;
  console.log("My Pusher Event " + pusherEvent);
  pusherPosition = `pusher${pusherId === 1 ? 2 : 1} position`;
  console.log("Pusher Position " + pusherPosition);
  myId = args.cid;
});

export default class Game extends Phaser.Scene {
  preload() {
    this.load.image("puk", "./assets/Puk.png");
    this.load.image("pusher1", "./assets/Pusher1.png");
    this.load.image("pusher2", "./assets/Pusher2.png");
    this.load.image("background", "./assets/Spielfeld.png");
  }
  create() {
    //socket.emit("connection");
    // Initial message on startup
    //socket.emit("getId");

    this.input.keyboard.on("keydown-SPACE", () => {
      console.log(JSON.stringify(myId));
    });

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

    myPusher = this.matter.add.image(
      250,
      pusherId === 1 ? 600 : 100,
      "pusher" + pusherId
    );

    myPusher.setBody({
      type: "circle",
      radius: 60,
    });

    myPusher.setMass(40);
    //pusher1.setAngularVelocity(0);
    //pusher.setRotation(0);
    if (myPusher.y > 350 || myPusher.y < 700) {
      myPusher.setCollisionGroup(canDrag);
    } else {
      myPusher.setCollisionGroup(noDrag);
    }

    myPusher.setBounce(0.1);
    myPusher.setFriction(0.3, 0, 0);

    pusherData.av = myPusher.body.angularVelocity;
    pusherData.vx = myPusher.body.velocity.x;
    pusherData.vy = myPusher.body.velocity.y;
    pusherData.x = myPusher.x;
    pusherData.y = myPusher.y;

    console.log(pusherData);

    const { angularVelocity, velocity } = myPusher.body;

    socket.emit(`pusher${pusherId === 1 ? 2 : 1}-init`, {
      angularVelocity,
      velocity,
      x: myPusher.x,
      y: myPusher.y,
    });

    ///
    pusherState.pusher2 = this.matter.add.image(
      250,
      myPusher.y === 100 ? 600 : 100,
      "pusher" + (pusherId === 1 ? 2 : 1)
    );

    pusherState.pusher2.setBody({
      type: "circle",
      radius: 60,
    });

    pusherState.pusher2.setMass(40);
    // pusher2.setAngularVelocity(0);
    //pusher.setRotation(0);
    pusherState.pusher2.setCollisionGroup(canDrag);
    pusherState.pusher2.setBounce(0.1);
    pusherState.pusher2.setFriction(0.3, 0, 0);

    pusherState.pusher2.setCollisionGroup(noDrag);

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
    //myPusher = pusherState[`pusher${pusherId}`];
    //notMyPusher = pusherState[`pusher${pusherId === 1 ? 2 : 1}`];
  }

  update() {
    collision = this.matter.sat.collides(myPusher.body, puk.body).collided;
    if (collision === true) {
      socket.emit("Switch collison state", pusherId);
    }
    //Turn off angular velocity Pusher 1 + 2
    myPusher.setAngularVelocity(0);
    //pusherState.pusher2.setAngularVelocity(0);

    // restrictMoveAreaPusher1();
    // restrictMoveAreaPusher2();

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

    // socket.emit("set score", scorePlayer1, scorePlayer2);

    // socket.on("score", (score1, score2) => {
    //   scorePlayer1 = score1;
    //   scorePlayer2 = score2;
    //   //console.log("test");
    //   $("#team1").html(scorePlayer1);
    //   $("#team2").html(scorePlayer2);
    // });
    // socket.on("score1", (score1) => {
    //   console.log("socket:" + score1);
    //   //$("#team1").html(score1);
    // });

    // socket.on("score2", (score2) => {
    //   $("#team2").html(score2);
    // });
    //console.log("velocity:" + puk.body.angularVelocity);

    //Position Pusher1 WebSocket

    socket.on("getSender", (senderId) => {
      sender = senderId;
      console.log("###############################", sender, pusherId);
    });

    if (sender === pusherId) {
      // events senden
      // Position Puk WebSocket
      setTimeout(function () {
        socket.emit(
          "puk moved",
          puk.x,
          puk.y,
          puk.body.velocity.x,
          puk.body.velocity.y,
          puk.body.angularVelocity
        );
      }, 0);
    } else {
      // auf events hören
      //puk.body.isStatic = true;
      socket.on("puk position", (posX, posY, velX, velY, angVel) => {
        puk.x = posX;
        puk.y = posY;
        puk.body.velocity.x = velX;
        puk.body.velocity.y = velY;
        puk.body.angularVelocity = angVel;
        //console.log("puk moved");
        // puk.setAngularVelocity(angVel);
      });
    }

    if (
      Math.floor(pusherData.x) !== Math.floor(myPusher.x) ||
      Math.floor(pusherData.y) !== Math.floor(myPusher.y) ||
      Math.floor(pusherData.av) !== Math.floor(myPusher.body.angularVelocity) ||
      Math.floor(pusherData.vx) !== Math.floor(myPusher.body.velocity.x) ||
      Math.floor(pusherData.vy) !== Math.floor(myPusher.body.velocity.y)
    ) {
      socket.emit(
        pusherEvent,
        Math.floor(myPusher.x),
        Math.floor(myPusher.y),
        Math.floor(myPusher.body.angularVelocity),
        Math.floor(myPusher.body.velocity.x),
        Math.floor(myPusher.body.velocity.y)
      );
      pusherData.x = myPusher.x;
      pusherData.y = myPusher.y;
      pusherData.av = myPusher.body.angularVelocity;
      pusherData.vx = myPusher.body.velocity.x;
      pusherData.vy = myPusher.body.velocity.y;
    }

    setTimeout(function () {
      socket.on(pusherPosition, (posX, posY, angularVelocity, velx, vely) => {
        pusherState.pusher2.x = posX;
        pusherState.pusher2.y = posY;
        pusherState.pusher2.angularVelocity = angularVelocity;
        pusherState.pusher2.velocity = { velx, vely };
      });
    }, 0);
    //Position Pusher1 WebSocket
    // socket.emit("pusher2 moved", pusher2.x, pusher2.y);
    // socket.on("pusher2 position", (posX, posY) => {
    //   pusher2.x = posX;
    //   pusher2.y = posY;
    // });
  }
}

function resetGame() {
  setTimeout(function () {
    puk.x = 250;
    puk.y = 350;
    puk.setAngularVelocity(0.01);
    puk.setVelocity(0);
    pusherState.pusher1.x = 250;
    pusherState.pusher1.y = 600;
    pusherState.pusher1.setAngularVelocity(0);
    pusherState.pusher1.setVelocity(0);
    pusherState.pusher2.x = 250;
    pusherState.pusher2.y = 100;
    pusherState.pusher2.setAngularVelocity(0);
    pusherState.pusher2.setVelocity(0);
    // pusher1.setCollisionGroup(canDrag);
    // pusher2.setCollisionGroup(canDrag);
    setScore = true;
  }, 500);
}

function restrictMoveAreaPusher1() {
  //restrict move radius pusher1 top
  if (pusherState.pusher1.y > 350) {
    pusherState.pusher1.setCollisionGroup(canDrag);
  } else {
    pusherState.pusher1.setCollisionGroup(-1);
    pusherState.pusher1.y = 350;
  }
  //restrict move radius pusher1 bottom
  if (pusherState.pusher1.y <= 700) {
    pusherState.pusher1.setCollisionGroup(canDrag);
  } else {
    pusherState.pusher1.setCollisionGroup(noDrag);
    pusherState.pusher1.y = 700;
  }
}

function restrictMoveAreaPusher2() {
  //restrict move radius pusher2 top
  if (pusherState.pusher2.y >= 0) {
    pusherState.pusher2.setCollisionGroup(canDrag);
  } else {
    pusherState.pusher2.setCollisionGroup(noDrag);
    pusherState.pusher2.y = 0;
  }
  //restrict move radius pusher2 bottom
  if (pusherState.pusher2.y <= 350) {
    pusherState.pusher2.setCollisionGroup(canDrag);
  } else {
    pusherState.pusher2.setCollisionGroup(noDrag);
    pusherState.pusher2.y = 350;
  }
}
