import Phaser from "phaser";

class OptionsScene extends Phaser.Scene {
  soundsOn = true;

  constructor() {
    super({
      key: "OptionsScene",
      active: true,
    });
  }

  create() {
    this.soundsOn = localStorage.getItem("sounds_on") === "true" ? true : false;
    this.gameMusic = this.sound.add("game-music", { loop: true });
    this.gameWin = this.sound.add("game-win");
    this.gameLose = this.sound.add("game-lose");
    this.clickSound = this.sound.add("click-sound");
    this.onOffSound = this.sound.add("onoff-sound");

    this.molePunch = this.sound.add("mole-punch");
    this.moleHide = this.sound.add("mole-hide");
    this.bombBlust = this.sound.add("bomb-blust");

    this.gameMusic.play();

    this.soundBtn = this.add
      .image(this.scale.width - 16, 8, "sound-on")
      .setScale(0.06)
      .setDepth(4)
      .setOrigin(1, 0)
      .setInteractive({ cursor: "pointer" });

    if (!this.soundsOn) {
      this.gameMusic.setVolume(0);
      this.gameWin.setVolume(0);
      this.gameLose.setVolume(0);
      this.clickSound.setVolume(0);
      this.onOffSound.setVolume(0);
      this.moleHide.setVolume(0);
      this.molePunch.setVolume(0);
      this.bombBlust.setVolume(0);
      this.soundBtn.setTexture("sound-off");
    }

    this.soundBtn.on("pointerup", () => {
      if (this.soundsOn) {
        this.soundsOn = false;
        this.onOffSound.play();
        this.gameMusic.setVolume(0);
        this.gameWin.setVolume(0);
        this.gameLose.setVolume(0);
        this.clickSound.setVolume(0);
        this.onOffSound.setVolume(0);
        this.moleHide.setVolume(0);
        this.molePunch.setVolume(0);
        this.bombBlust.setVolume(0);
        this.soundBtn.setTexture("sound-off");
      } else {
        this.soundsOn = true;
        this.onOffSound.play();
        this.gameMusic.setVolume(1);
        this.gameWin.setVolume(1);
        this.gameLose.setVolume(1);
        this.clickSound.setVolume(1);
        this.onOffSound.setVolume(1);
        this.moleHide.setVolume(1);
        this.molePunch.setVolume(1);
        this.bombBlust.setVolume(1);
        this.soundBtn.setTexture("sound-on");
      }
      localStorage.setItem("sounds_on", this.soundsOn);
    });
  }
}

export default OptionsScene;
