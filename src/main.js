//import Phaser from "phaser";
import TitleScreen from "./scenes/TitleScreen.js";
import Game from "./scenes/Game.js";
import TestGame from "./scenes/TestGame.js";
import MatterGame from "./scenes/MatterGame.js";
import WinningScreen from "./scenes/WinningScreen.js";

const config = {
  width: 500,
  height: 700,
  type: Phaser.AUTO,
  // physics: {
  //   default: "arcade",
  //   arcade: {
  //     gravity: { y: 0 },
  //     debug: true,
  //   },
  // },
  physics: {
    default: "matter",
    matter: {
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);

game.scene.add("titlescreen", TitleScreen);
game.scene.add("game", Game);
game.scene.add("testgame", TestGame);
game.scene.add("mattergame", MatterGame);
game.scene.add("winningscreen", WinningScreen);

// game.scene.start("titlescreen");
game.scene.start("titlescreen");
