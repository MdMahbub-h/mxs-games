import Phaser from "phaser";

class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  create() {
    this.userData = this.game.registry.get("user_data");
    this.gameData = this.game.registry.get("game_data");

    this.optionsScene = this.game.scene.getScene("OptionsScene");
    this.add.image(this.scale.width / 2, 160, "brand_logo").setScale(0.1);
    this.uidText = this.add
      .text(this.scale.width / 2, this.scale.height / 2, `UID: ${this.userData.user_id}`, {
        fontSize: 24,
        align: "center",
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 60, `You have to earn score 500 to win and get ${this.gameData.rewardCount} GOLD.`, {
        fontSize: 24,
        align: "center",
        lineSpacing: 8,
      })
      .setWordWrapWidth(500)
      .setOrigin(0.5);

    const playBtn = this.add
      .image(this.scale.width / 2, this.scale.height / 2 + 200, "play_btn")
      .setScale(0.15)
      .setInteractive({
        cursor: "pointer",
      });

    playBtn.on("pointerdown", () => {
      playBtn.setTexture("play_btn_click");
    });

    playBtn.on("pointerout", () => {
      playBtn.setTexture("play_btn");
    });

    playBtn.on("pointerup", () => {
      this.startGame();
    });
  }

  async startGame() {
    this.optionsScene.clickSound.play();
    this.scene.stop();
    this.scene.start("GameScene");
  }

  update() {
    this.uidText.setText(`UID: ${this.userData.user_id}`);
  }
}

export default StartScene;
