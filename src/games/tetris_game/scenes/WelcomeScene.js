import Phaser from "phaser";
import OptionsScene from "./OptionsScene";

class WelcomeScene extends Phaser.Scene {
  constructor() {
    super("WelcomeScene");
  }
  preload() {
    this.load.image("retry_btn", "assets/buttons/retry_btn.png");
    this.load.image("claim_btn", "assets/buttons/claim_btn.png");
    this.load.image("play_btn", "assets/buttons/play_btn.png");
    this.load.image("sound-on", "assets/buttons/sound-on.png");
    this.load.image("sound-off", "assets/buttons/sound-off.png");
    this.load.image("brand_logo", "assets/buttons/mxs_logo_stack_white.png");
    this.load.image("play_btn_click", "assets/buttons/play_btn_click.png");

    this.load.image("background", "assets/tetris_game/images/whiteBackground2.png");

    this.load.image("red", "assets/tetris_game/images/red.png");
    this.load.image("purple", "assets/tetris_game/images/purple.png");
    this.load.image("blue", "assets/tetris_game/images/blue.png");
    this.load.image("dark_blue", "assets/tetris_game/images/dark_blue.png");
    this.load.image("yellow", "assets/tetris_game/images/yellow.png");
    this.load.image("green", "assets/tetris_game/images/green.png");
    this.load.image("orange", "assets/tetris_game/images/orange.png");

    this.load.image("redTile", "assets/tetris_game/images/redTile.png");
    this.load.image("purpleTile", "assets/tetris_game/images/purpleTile.png");
    this.load.image("blueTile", "assets/tetris_game/images/blueTile.png");
    this.load.image("darkBlueTile", "assets/tetris_game/images/darkBlueTile.png");
    this.load.image("yellowTile", "assets/tetris_game/images/yellowTile.png");
    this.load.image("greenTile", "assets/tetris_game/images/greenTile.png");
    this.load.image("orangeTile", "assets/tetris_game/images/orangeTile.png");
    this.load.image("grayTile", "assets/tetris_game/images/grayTile.png");

    this.load.audio("game-music", "assets/sounds/game-music.mp3");
    this.load.audio("click-sound", "assets/sounds/click-sound.mp3");
    this.load.audio("onoff-sound", "assets/sounds/onoff-sound.mp3");
  }

  create() {
    this.add.image(this.scale.width / 2, 160, "brand_logo").setScale(0.1);

    this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 40, "Welcome to MXS Archery.\nPlay and get reward.", {
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
