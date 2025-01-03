import Phaser from "phaser";
import Swal from "sweetalert2";
import { showRewardAd } from "../../../utils/adManager";
import { claimReward } from "../../../utils/apiActions";

class WinScene extends Phaser.Scene {
  constructor() {
    super("WinScene");
  }

  create() {
    this.userData = this.game.registry.get("user_data");
    this.gameData = this.game.registry.get("game_data");

    this.optionsScene = this.game.scene.getScene("OptionsScene");
    this.claiming = false;
    this.congretsText = this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 180, `Congrets!\nYou've Win!`, {
        fontSize: "54px",
        fill: "#fff",
        align: "center",
        fontWeight: "bold",
        lineSpacing: 10,
      })
      .setOrigin(0.5);
    this.rewardText = this.add
      .text(this.scale.width / 2, this.scale.height / 2, `You got ${this.gameData.rewardCount} GOLD`, {
        fontSize: "35px",
        fill: "#fff",
        align: "center",
        lineSpacing: 10,
      })
      .setOrigin(0.5);

    const claimBtn = this.add
      .image(this.scale.width / 2, this.scale.height / 2 + 100, "claim_btn")
      .setScale(0.3)
      .setInteractive({ cursor: "pointer" });

    claimBtn.on("pointerup", () => {
      if (this.claiming) return;
      this.claiming = true;
      this.optionsScene.clickSound.play();
      claimBtn.setTint(0x999999);
      claimBtn.disableInteractive();
      this.rewardText.setText("Claiming\nPlease wait...");
      showRewardAd((value) => {
        console.log(value.message);
        if (value.success) {
          claimReward("game_web_match", this.userData.user_id)
            .then((res) => {
              Swal.fire({
                title: "Success!",
                text: `Congratulations you have been awarded ${this.gameData.rewardCount} GOLD`,
                icon: "success",
                confirmButtonText: "OK",
              }).then((result) => {
                this.scene.stop();
                this.scene.start("StartScene");
              });
            })
            .catch((err) => {
              Swal.fire({
                title: "Error!",
                text: `Sorry, something went wrong!`,
                icon: "error",
                confirmButtonText: "OK",
              }).then((result) => {
                this.scene.stop();
                this.scene.start("StartScene");
              });
            });
        } else {
          this.claiming = false;
          this.scene.stop();
          this.scene.start("StartScene");
        }
      });
    });
  }
}

export default WinScene;
