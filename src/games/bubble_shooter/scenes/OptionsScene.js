import Phaser from "phaser";
import { TILE_SIZE } from "../utils/Constants";

class OptionsScene extends Phaser.Scene {
  soundsOn = true;
  gameMusic;
  clickSound;
  onOffSound;
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
    this.launchBubble = this.sound.add("launch-bubble");
    this.targetBubble = this.sound.add("target-bubble");
    this.nonTargetBubble = this.sound.add("non-target-bubble");
    this.selectNavigation = this.sound.add("select-navigation");
    this.switchNavigation = this.sound.add("switch-navigation");

    this.gameMusic.play();

    this.soundBtn = this.add
      .image(this.scale.width - TILE_SIZE, 3, "sound-on")
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
      this.launchBubble.setVolume(0);
      this.targetBubble.setVolume(0);
      this.nonTargetBubble.setVolume(0);
      this.selectNavigation.setVolume(0);
      this.switchNavigation.setVolume(0);
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
        this.launchBubble.setVolume(0);
        this.targetBubble.setVolume(0);
        this.nonTargetBubble.setVolume(0);
        this.selectNavigation.setVolume(0);
        this.switchNavigation.setVolume(0);
        this.soundBtn.setTexture("sound-off");
      } else {
        this.soundsOn = true;
        this.onOffSound.play();
        this.gameMusic.setVolume(1);
        this.gameWin.setVolume(1);
        this.gameLose.setVolume(1);
        this.clickSound.setVolume(1);
        this.onOffSound.setVolume(1);
        this.launchBubble.setVolume(1);
        this.targetBubble.setVolume(1);
        this.nonTargetBubble.setVolume(1);
        this.selectNavigation.setVolume(1);
        this.switchNavigation.setVolume(1);
        this.soundBtn.setTexture("sound-on");
      }
      localStorage.setItem("sounds_on", this.soundsOn);
    });
  }
}

export default OptionsScene;
