//import Phaser from "phaser";
var faktor = 0.8;
var puk;
var sender = 1;
var pusherState = {
  pusher1: null,
  pusher2: null,
};
var playerScore = { player1: null, player2: null };
var setScore = true;
var noDrag;
var canDrag;
var myId = {};
var pusherId = null;
var pusherEvent = "";
var pusherPosition = "";
var myPusher;
var collision;
var enemyColission;
var connect = false;
var initialized = false;

var pusherData = {
  x: 0,
  y: 0,
  av: 0,
  vx: 0,
  vy: 0,
};

//Set up information at first connection
socket.on("*id", function (args) {
  pusherId = args.pusher;
  console.log(pusherId);
  pusherEvent = `pusher${pusherId} moved`;
  console.log("My Pusher Event " + pusherEvent);
  pusherPosition = `pusher${pusherId === 1 ? 2 : 1} position`;
  console.log("Pusher Position " + pusherPosition);
  myId = args.cid;
  connect = true;
});

export default class Game extends Phaser.Scene {
  preload() {
    this.load.image("puk", "./assets/Puk.png");
    this.load.image("pusher1", "./assets/Pusher1.png");
    this.load.image("pusher2", "./assets/Pusher2.png");
    this.load.image("background", "./assets/Spielfeld.png");

    socket.on("getSender", (senderId) => {
      if (senderId !== pusherId) {
        sender = senderId;
        //puk.setFriction(0.8, 0.8, 0.8);
      }
    });

    socket.on("puk position", (posX, posY, velX, velY, angVel) => {
      if (sender !== pusherId) {
        puk.x = posX;
        puk.y = posY;
        puk.body.velocity.x = velX;
        puk.body.velocity.y = velY;
        puk.body.angularVelocity = angVel;
      }
    });

    socket.on("other pusher position", (posX, posY, velx, vely) => {
      pusherState.pusher2.setPosition(posX, posY);
      pusherState.pusher2.setVelocity(velx, vely);
      pusherState.pusher2.applyForce(new Phaser.Math.Vector2(0, 0));
    });

    socket.on("set score", (score) => {
      $("#team1").html(score.player1);
      $("#team2").html(score.player2);
      playerScore.player1 = score.player1;
      playerScore.player2 = score.player2;
      console.log(playerScore.player1);
    });
  }

  create() {
    //Set up gamefield
    this.add.image(250 * faktor, 350 * faktor, "background");
    this.matter.world.disableGravity();
    //borders
    noDrag = this.matter.world.nextGroup();
    var leftBorder = this.matter.add.rectangle(0, 0, 1, 1400 * faktor, {
      isStatic: true,
    });
    var rightBorder = this.matter.add.rectangle(
      500 * faktor,
      0,
      1,
      1400 * faktor,
      {
        isStatic: true,
      }
    );
    var topLeft = this.matter.add.rectangle(0, 0, 350 * faktor, 1, {
      isStatic: true,
    });
    var topRight = this.matter.add.rectangle(500 * faktor, 0, 350 * faktor, 1, {
      isStatic: true,
    });
    var bottomLeft = this.matter.add.rectangle(
      0,
      700 * faktor,
      350 * faktor,
      1,
      {
        isStatic: true,
      }
    );
    var bottomRight = this.matter.add.rectangle(
      500 * faktor,
      700 * faktor,
      350 * faktor,
      1,
      {
        isStatic: true,
      }
    );

    //Set up puk
    puk = this.matter.add.image(250 * faktor, 350 * faktor, "puk");
    //  Change the body of puck to a circle with a radius of 30px
    puk.setBody({
      type: "circle",
      radius: 30 * faktor,
    });
    // Make the body move around and bounce
    puk.setAngularVelocity(0.01);
    puk.setBounce(0.7);
    puk.setFriction(0.05, 0, 0);
    puk.setMass(5);
    puk.setCollisionGroup(noDrag);
  }

  //GameLoop
  update() {
    if (connect == true) {
      //Set up myPusher
      canDrag = this.matter.world.nextGroup();
      myPusher = this.matter.add.image(
        250 * faktor,
        pusherId === 1 ? 600 * faktor : 100 * faktor,
        "pusher" + pusherId
      );
      //  Change the body of puck to a circle with a radius of 60px
      myPusher.setBody({
        type: "circle",
        radius: 60 * faktor,
      });
      //Set physics
      myPusher.setMass(40);
      myPusher.setBounce(0.1);
      myPusher.setFriction(0.3, 0, 0);
      // Set colissionGroup for Drag&Drop
      if (myPusher.y > 350 * faktor || myPusher.y < 700 * faktor) {
        myPusher.setCollisionGroup(canDrag);
      } else {
        myPusher.setCollisionGroup(noDrag);
      }
      //fill pusherData object with data of my pusher
      pusherData.av = myPusher.body.angularVelocity;
      pusherData.vx = myPusher.body.velocity.x;
      pusherData.vy = myPusher.body.velocity.y;
      pusherData.x = myPusher.x;
      pusherData.y = myPusher.y;

      //Set up pusher2
      pusherState.pusher2 = this.matter.add.image(
        250 * faktor,
        myPusher.y === 100 * faktor ? 600 * faktor : 100 * faktor,
        "pusher" + (pusherId === 1 ? 2 : 1)
      );
      //  Change the body of puck to a circle with a radius of 60px
      pusherState.pusher2.setBody({
        type: "circle",
        radius: 60 * faktor,
      });

      //set physics
      pusherState.pusher2.setMass(40);
      pusherState.pusher2.setBounce(0.1);
      pusherState.pusher2.setFriction(0.8, 0.8, 0.8);
      pusherState.pusher2.setCollisionGroup(noDrag);
      //add Drag&Drop function to collisionGroup canDrag: myPusher
      this.matter.add.mouseSpring({
        collisionFilter: { group: canDrag },
      });

      connect = false;
      initialized = true;
    }

    if (initialized === true) {
      restrictMoveAreaPusher();
      //Turn off angular velocity Pusher 1 + 2
      myPusher.setAngularVelocity(0);

      collision = this.matter.sat.collides(myPusher.body, puk.body).collided;

      if (collision === true) {
        puk.setFriction(0.05, 0, 0);
        console.log(collision);
        sender = pusherId;
        socket.emit("Switch collison state", pusherId);
      }

      if (sender === pusherId) {
        // events senden
        // Position Puk WebSocket
        socket.emit(
          "puk moved",
          Math.floor(puk.x),
          Math.floor(puk.y),
          Math.floor(puk.body.velocity.x),
          Math.floor(puk.body.velocity.y),
          Math.floor(puk.body.angularVelocity)
        );
      }

      //Position Pusher1 WebSocket
      if (
        Math.floor(pusherData.x) !== Math.floor(myPusher.x) ||
        Math.floor(pusherData.y) !== Math.floor(myPusher.y) ||
        Math.floor(pusherData.av) !==
          Math.floor(myPusher.body.angularVelocity) ||
        Math.floor(pusherData.vx) !== Math.floor(myPusher.body.velocity.x) ||
        Math.floor(pusherData.vy) !== Math.floor(myPusher.body.velocity.y)
      ) {
        socket.emit(
          pusherEvent,
          Math.floor(myPusher.x),
          Math.floor(myPusher.y),
          Math.floor(myPusher.body.velocity.x),
          Math.floor(myPusher.body.velocity.y)
        );
        pusherData.x = myPusher.x;
        pusherData.y = myPusher.y;
        pusherData.av = myPusher.body.angularVelocity;
        pusherData.vx = myPusher.body.velocity.x;
        pusherData.vy = myPusher.body.velocity.y;
      }

      //Goal Detection + Reset Puk + Pusher
      if (puk.y <= -30 * faktor && setScore) {
        setScore = false;
        if (pusherId === 1) {
          socket.emit("score player1");
        }
        resetGame();
        // $("#team1").html(scorePlayer1);
      } else if (puk.y >= 730 * faktor && setScore) {
        setScore = false;
        if (pusherId === 2) {
          socket.emit("score player2");
        }
        resetGame();
      }

      if (playerScore.player1 === 1 || playerScore.player2 === 1) {
        this.scene.start("winningscreen");
      }
    }
  }
}

function resetGame() {
  if (initialized === true) {
    puk.x = 250 * faktor;
    puk.y = 350 * faktor;
    puk.setAngularVelocity(0.01);
    puk.setVelocity(0);
    if (pusherId === 1) {
      myPusher.x = 250 * faktor;
      myPusher.y = 600 * faktor;
      myPusher.setAngularVelocity(0);
      myPusher.setVelocity(0);
    } else if (pusherId === 2) {
      myPusher.x = 250 * faktor;
      myPusher.y = 100 * faktor;
      myPusher.setAngularVelocity(0);
      myPusher.setVelocity(0);
    }
    setTimeout(function () {
      setScore = true;
    }, 1000);
  }
}

function restrictMoveAreaPusher() {
  if (initialized === true) {
    //restrict move radius pusher
    if (myPusher.y < 350 * faktor && pusherId === 1) {
      myPusher.y = 350 * faktor;
      myPusher.setVelocity(0);
    } else if (myPusher.y > 700 * faktor && pusherId === 1) {
      myPusher.y = 700 * faktor;
      myPusher.setVelocity(0);
    } else if (myPusher.y < 0 && pusherId === 2) {
      myPusher.y = 0;
      myPusher.setVelocity(0);
    } else if (myPusher.y > 350 * faktor && pusherId === 2) {
      myPusher.y = 350 * faktor;
      myPusher.setVelocity(0);
    }
  }
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
