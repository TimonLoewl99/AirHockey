//import Phaser from "phaser";

export default class TitleScreen extends Phaser.Scene {
  preload() {}

  create() {
    const titleScreen = this.add.text(400, 250, "Air Hockey");
    titleScreen.setOrigin(0.5, 0.5);
  }
}
