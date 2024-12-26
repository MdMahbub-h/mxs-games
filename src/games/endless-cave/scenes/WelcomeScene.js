import Phaser from "phaser";
import OptionsScene from "./OptionsScene";

class WelcomeScene extends Phaser.Scene {
  constructor() {
    super("WelcomeScene");
  }
  preload() {
    this.load.bitmapFont(
      "upheaval",
      "assets/fonts/upheaval/font5.png",
      "assets/fonts/upheaval/font.fnt"
    );

    this.load.image("retry_btn", "assets/buttons/retry_btn.png");
    this.load.image("claim_btn", "assets/buttons/claim_btn.png");
    this.load.image("play_btn", "assets/buttons/play_btn.png");
    this.load.image("sound-on", "assets/buttons/sound-on.png");
    this.load.image("sound-off", "assets/buttons/sound-off.png");
    this.load.image("brand_logo", "assets/buttons/mxs_logo_stack_white.png");
    this.load.image("play_btn_click", "assets/buttons/play_btn_click.png");

    this.load.image("background", "assets/endless_cave/map/bg/bg.png");
    this.load.image(
      "mana-potion",
      "assets/endless_cave/map/objects/Energy.png"
    );

    this.load.spritesheet("boy", "assets/endless_cave/boy/boy-sheet.png", {
      frameWidth: 80,
      frameHeight: 128,
    });
    this.load.spritesheet("girl", "assets/endless_cave/girl/girl-sheet.png", {
      frameWidth: 80,
      frameHeight: 128,
    });

    this.load.atlas({
      key: "tiles",
      atlasURL: "assets/endless_cave/map/tiles/texture.json",
      textureURL: "assets/endless_cave/map/tiles/texture.png",
    });
    this.load.atlas({
      key: "objects",
      atlasURL: "assets/endless_cave/map/objects/texture.json",
      textureURL: "assets/endless_cave/map/objects/texture.png",
    });

    this.load.audio("game-music", "assets/sounds/game-music.mp3");
    this.load.audio("click-sound", "assets/sounds/click-sound.mp3");
    this.load.audio("onoff-sound", "assets/sounds/onoff-sound.mp3");

    this.load.audio("game-win", [
      "assets/sounds/mp3/game-win.mp3",
      "assets/sounds/ogg/game-win.ogg",
    ]);
    this.load.audio("game-lose", [
      "assets/sounds/mp3/game-lose.mp3",
      "assets/sounds/ogg/game-lose.ogg",
    ]);

    this.load.audio("mole-punch", "assets/sounds/wam/punch.mp3");
    this.load.audio("mole-hide", "assets/sounds/wam/disappear.mp3");
    this.load.audio("bomb-blust", "assets/sounds/wam/explosion.mp3");
  }

  create() {
    this.add.image(this.scale.width / 2, 160, "brand_logo").setScale(0.1);

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 40,
        "Welcome to MXS Endless Cave.\nPlay and get reward.",
        {
          fontSize: 26,
          align: "center",
          lineSpacing: 8,
        }
      )
      .setWordWrapWidth(600)
      .setOrigin(0.5);

    let width = this.scale.width;
    let height = this.scale.height;

    let pwidth = width - 200;
    let pheight = 5;

    let progressBox = this.add.graphics();
    let progressBar = this.add.graphics();

    progressBox.fillStyle(0x000000, 0.8);
    progressBox.fillRect(
      width / 2 - pwidth / 2,
      height - 110,
      pwidth + 4,
      pheight + 4
    );

    let time = 0;
    let timer = this.time.addEvent({
      delay: 20,
      callback: () => {
        progressBar.clear();
        progressBar.fillStyle(0x42eacb, 1);
        progressBar.fillRect(
          width / 2 - pwidth / 2 + 2,
          height - 108,
          pwidth * time,
          pheight
        );
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
