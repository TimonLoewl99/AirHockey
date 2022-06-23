//import Phaser from "phaser";

export default class TitleScreen extends Phaser.Scene {
  preload() {}

  create() {
    const title = this.add.text(250, 350, "Air Hockey", {
      fontSize: 40,
      fontFamily: '"Press Start 2P"',
    });

    title.setOrigin(0.5, 0.5);

    this.add
      .text(250, 400, "Drücke die Leertaste, um das Spiel zu starten", {
        fontFamily: '"Press Start 2P"',
        fontSize: 10,
      })
      .setOrigin(0.5);

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("mattergame");
      console.log("Space pressed");
    });
  }
}
