//socket = io();
var playerConnection = {
  player1: false,
  player2: false,
};

socket.on("player connection", (connection) => {
  playerConnection.player1 = connection.player1;
  playerConnection.player2 = connection.player2;
});

socket.on("connection status", (connection) => {
  playerConnection.player1 = connection.player1;
  playerConnection.player2 = connection.player2;
});

//import Phaser from "phaser";
export default class TitleScreen extends Phaser.Scene {
  preload() {
    this.load.image("puk", "./assets/Puk.png");
    this.load.image("pusher1", "./assets/Pusher1.png");
    this.load.image("pusher2", "./assets/Pusher2.png");
    this.load.image("background", "./assets/Spielfeld.png");
  }

  create() {
    this.add.image(250, 350, "background");
    var btnPlayer1 = this.add.image(150, 500, "pusher1").setInteractive();
    var btnPlayer2 = this.add.image(350, 500, "pusher2").setInteractive();
    this.add.image(250, 350, "puk");

    const title = this.add.text(250, 170, "Air Hockey", {
      fontSize: 40,
      fontFamily: '"Press Start 2P"',
      color: "#000",
    });

    title.setOrigin(0.5, 0.5);

    this.add
      .text(250, 230, "Wähle einen Schläger!", {
        fontFamily: '"Press Start 2P"',
        fontSize: 15,
        color: "000",
      })
      .setOrigin(0.5);

    btnPlayer1.on("pointerdown", () => {
      if (playerConnection.player1 === false) {
        socket.emit("player1 connected");
        //setTimeout
        this.scene.start("mattergame");
      }
    });

    btnPlayer1.on("pointerover", () => {
      btnPlayer1.setTint(0xc0c2ce);
      socket.emit("update connection");
      console.log(playerConnection);
    });

    btnPlayer1.on("pointerout", function (event) {
      btnPlayer1.clearTint();
    });

    btnPlayer2.on("pointerdown", () => {
      if (playerConnection.player2 === false) {
        socket.emit("player2 connected");
        this.scene.start("mattergame");
      }
    });

    btnPlayer2.on("pointerover", () => {
      btnPlayer2.setTint(0xc0c2ce);
      socket.emit("update connection");
      console.log(playerConnection);
    });

    btnPlayer2.on("pointerout", function (event) {
      btnPlayer2.clearTint();
    });

    console.log(playerConnection);
  }
}
