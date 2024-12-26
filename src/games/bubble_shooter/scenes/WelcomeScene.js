import Phaser from "phaser";
import OptionsScene from "./OptionsScene";

class WelcomeScene extends Phaser.Scene {
  constructor() {
    super("WelcomeScene");
  }
  preload() {
    this.load.bitmapFont("upheaval", "assets/fonts/upheaval/font5.png", "assets/fonts/upheaval/font.fnt");

    this.load.image("retry_btn", "assets/buttons/retry_btn.png");
    this.load.image("claim_btn", "assets/buttons/claim_btn.png");
    this.load.image("play_btn", "assets/buttons/play_btn.png");
    this.load.image("sound-on", "assets/buttons/sound-on.png");
    this.load.image("sound-off", "assets/buttons/sound-off.png");
    this.load.image("brand_logo", "assets/buttons/mxs_logo_stack_white.png");
    this.load.image("play_btn_click", "assets/buttons/play_btn_click.png");

    this.load.spritesheet("bubbles", "assets/bubble_shooter/images/bubbles.png", { frameWidth: 41.666, frameHeight: 41.666 });
    this.load.image("tile-2", "assets/bubble_shooter/images/tile-sm-2.png");
    this.load.image("arrow-1", "assets/bubble_shooter/images/arrow-sm-1.png");
    this.load.image("block-1", "assets/bubble_shooter/images/block-sm-1.png");

    this.load.audio("game-music", "assets/sounds/game-music.mp3");
    this.load.audio("click-sound", "assets/sounds/click-sound.mp3");
    this.load.audio("onoff-sound", "assets/sounds/onoff-sound.mp3");

    this.load.audio("game-win", ["assets/sounds/mp3/game-win.mp3", "assets/sounds/ogg/game-win.ogg"]);
    this.load.audio("game-lose", ["assets/sounds/mp3/game-lose.mp3", "assets/sounds/ogg/game-lose.ogg"]);
    this.load.audio("launch-bubble", ["assets/sounds/mp3/launch-bubble.mp3", "assets/sounds/ogg/launch-bubble.ogg"]);
    this.load.audio("target-bubble", ["assets/sounds/mp3/target-bubble.mp3", "assets/sounds/ogg/target-bubble.ogg"]);
    this.load.audio("non-target-bubble", ["assets/sounds/mp3/non-target-bubble.mp3", "assets/sounds/ogg/non-target-bubble.ogg"]);
    this.load.audio("select-navigation", ["assets/sounds/mp3/select-navigation.mp3", "assets/sounds/ogg/select-navigation.ogg"]);
    this.load.audio("switch-navigation", ["assets/sounds/mp3/switch-navigation.mp3", "sassets/sounds/ogg/witch-navigation.ogg"]);
  }

  create() {
    this.add.image(this.scale.width / 2, 160, "brand_logo").setScale(0.1);
    this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 40, "Welcome to MXS BUBBLE SHOOTER.\nPlay and get reward.", {
        fontSize: 26,
        align: "center",
        lineSpacing: 8,
      })
      .setWordWrapWidth(600)
      .setOrigin(0.5);

    let width = this.scale.width;
    let height = this.scale.height;

    let pwidth = width - 200;
    let pheight = 5;

    let progressBox = this.add.graphics();
    let progressBar = this.add.graphics();

    progressBox.fillStyle(0x000000, 0.8);
    progressBox.fillRect(width / 2 - pwidth / 2, height - 110, pwidth + 4, pheight + 4);

    let time = 0;
    let timer = this.time.addEvent({
      delay: 20,
      callback: () => {
        progressBar.clear();
        progressBar.fillStyle(0x42eacb, 1);
        progressBar.fillRect(width / 2 - pwidth / 2 + 2, height - 108, pwidth * time, pheight);
        if (time >= 1) {
          progressBar.destroy();
          progressBox.destroy();
          this.time.removeEvent(timer);
          this.scene.start("StartScene");
          this.game.scene.add("OptionsScene", new OptionsScene(), true);
        } else {
          time += 0.01;
        }
      },
      callbackScope: this,
      loop: true,
    });
  }
}

export default WelcomeScene;
