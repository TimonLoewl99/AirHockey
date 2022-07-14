import TitleScreen from "./scenes/TitleScreen.js";
import MatterGame from "./scenes/MatterGame.js";
import WinningScreen from "./scenes/WinningScreen.js";

const config = {
  width: 400,
  height: 560,
  type: Phaser.AUTO,
  physics: {
    default: "matter",
    matter: {
      debug: true,
    },
  },
};

const game = new Phaser.Game(config);

game.scene.add("titlescreen", TitleScreen);
game.scene.add("mattergame", MatterGame);
game.scene.add("winningscreen", WinningScreen);

game.scene.start("titlescreen");
