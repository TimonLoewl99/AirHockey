var winner = null;

export default class TitleScreen extends Phaser.Scene {
  preload() {
    this.load.image("background", "./assets/Spielfeld.png");

    socket.on("game over", (score) => {
      if (score.player1 === 1) {
        winner = "Spieler1";
      } else if (score.player2 === 1) {
        winner = "Spieler2";
      }
    });

    loadFont("Press Start 2P", "./fonts/PressStart2P-Regular.ttf");
  }

  create() {
    socket.emit("get game information");

    this.add.image(250, 350, "background");

    console.log(winner);
  }
  update() {
    if (winner !== null) {
      this.add
        .text(250, 230, winner + " gewinnt", {
          fontFamily: '"Press Start 2P"',
          fontSize: 30,
          color: "000",
        })
        .setOrigin(0.5);
    }
    //console.log(winner);
  }
}

function loadFont(name, url) {
  var newFont = new FontFace(name, `url(${url})`);
  newFont
    .load()
    .then(function (loaded) {
      document.fonts.add(loaded);
    })
    .catch(function (error) {
      return error;
    });
}
