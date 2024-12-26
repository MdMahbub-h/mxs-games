import Phaser from "phaser";

class LoseScene extends Phaser.Scene {
  constructor() {
    super("LoseScene");
  }

  create() {
    this.optionsScene = this.game.scene.getScene("OptionsScene");
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 180,
        "Game Over!\nYou've lost!",
        {
          fontSize: "54px",
          fill: "#fff",
          align: "center",
          fontWeight: "bold",
          lineSpacing: 22,
        }
      )
      .setOrigin(0.5);

    this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Try Again", {
        fontSize: "45px",
        fill: "#fff",
        align: "center",
      })
      .setOrigin(0.5);

    const tryAgainBtn = this.add
      .image(this.scale.width / 2, this.scale.height / 2 + 140, "retry_btn")
      .setScale(0.25)
      .setInteractive({ cursor: "pointer" });

    tryAgainBtn.on("pointerup", () => {
      this.optionsScene.clickSound.play();
      this.scene.stop();
      this.scene.start("GameScene");
    });
  }
}

export default LoseScene;
